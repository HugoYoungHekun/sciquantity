import { UnitError } from '../core/errors.js';
import type { ResolvedLanguage } from '../i18n/registry.js';
import type { UnitDef } from './unit.js';
import { createUnit, Unit } from './unit.js';
import { divideUnits, multiplyUnits, powerUnit } from './operations.js';

export class UnitRegistry {
  private defs = new Map<string, UnitDef>();
  private prefixBySymbol = new Map<string, { symbol: string; factor: number; group?: string }>();

  constructor() {
    this.usePrefixes([]);
  }

  /** 注册一组词头（后注册覆盖同 symbol 的旧值） */
  usePrefixes(
    prefixes: ReadonlyArray<{ symbol: string; factor: number; group?: string }>,
  ): this {
    for (const p of prefixes) {
      this.prefixBySymbol.set(p.symbol, p);
    }
    return this;
  }

  register(def: UnitDef): this {
    if (this.defs.has(def.id)) {
      throw new UnitError(`单位 id 已存在：${def.id}`);
    }
    this.defs.set(def.id, def);
    return this;
  }

  registerMany(defs: readonly UnitDef[]): this {
    for (const d of defs) this.register(d);
    return this;
  }

  getDef(id: string): UnitDef {
    const def = this.defs.get(id);
    if (!def) throw new UnitError(`未知单位 id：${id}`);
    return def;
  }

  /** 通过 defId 直接构造（不带词头） */
  byId(id: string): Unit {
    return createUnit(this.getDef(id));
  }

  /** 通过 defId + 词头符号构造 */
  byIdWithPrefix(id: string, prefixSymbol: string): Unit {
    const def = this.getDef(id);
    const prefix = this.prefixBySymbol.get(prefixSymbol);
    if (!prefix) throw new UnitError(`未知词头：${prefixSymbol}`);
    return createUnit(def, prefix);
  }

  /**
   * 解析单位字符串，如 'km/h'、'm^2'、'kg·m/s^2'、'毫米每秒'。
   * 需要一个已解析的语言对象用于文本反查。
   */
  parse(input: string, lang: ResolvedLanguage): Unit {
    const s = input.trim();
    if (!s) throw new UnitError('空单位字符串');

    // 1) 除法（优先级最低）
    const slash = s.indexOf('/');
    if (slash > 0) {
      const num = this.parse(s.slice(0, slash), lang);
      const den = this.parse(s.slice(slash + 1), lang);
      return divideUnits(num, den);
    }

    // 2) 乘法
    for (const sep of ['*', '·', ' ']) {
      const idx = s.indexOf(sep);
      if (idx > 0) {
        const left = this.parseTerm(s.slice(0, idx), lang);
        const right = this.parse(s.slice(idx + sep.length), lang);
        return multiplyUnits(left, right);
      }
    }

    // 3) 单项
    return this.parseTerm(s, lang);
  }

  private parseTerm(term: string, lang: ResolvedLanguage): Unit {
    const m = term.match(/^(.+?)\^(-?\d+(?:\.\d+)?)$/);
    const base = m ? m[1]! : term;
    const exp = m ? parseFloat(m[2]!) : 1;

    const unit = this.lookup(base, lang);
    if (!unit) throw new UnitError(`未知单位：${base}`);
    return exp === 1 ? unit : powerUnit(unit, exp);
  }

  /** 文本 → Unit：先精确匹配，再尝试“词头 + 单位” */
  private lookup(text: string, lang: ResolvedLanguage): Unit | null {
    const hit = lang.lookupUnitText(text);
    if (!hit) return null;

    const def = this.defs.get(hit.defId);
    if (!def) return null;

    if (!hit.prefix) return createUnit(def);

    const prefix = this.prefixBySymbol.get(hit.prefix);
    if (!prefix) return null;

    if (def.allowPrefix === false) return null;
    if (def.offset) return null;
    if (def.prefixGroup && def.prefixGroup !== prefix.group) return null;

    return createUnit(def, prefix);
  }
}