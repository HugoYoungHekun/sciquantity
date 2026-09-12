import { LanguageError } from '../core/errors.js'
import {
  DEFAULT_TEMPLATES,
  LanguagePack,
  LanguageTemplates,
  UnitExpression,
  PrefixExpression,
} from './types.js'

/** 反查结果：单位定义 id + 可选词头 symbol */
export interface UnitTextHit {
  defId: string
  prefix?: string
}

export class LanguageRegistry {
  private packs = new Map<string, LanguagePack>()
  private resolvedCache = new Map<string, ResolvedLanguage>()

  constructor(seed?: LanguagePack[]) {
    if (seed) this.registerMany(seed)
  }

  register(pack: LanguagePack): this {
    validatePack(pack)
    this.packs.set(pack.code, Object.freeze({ ...pack }))
    this.resolvedCache.clear()
    return this
  }

  registerMany(packs: readonly LanguagePack[]): this {
    for (const p of packs) this.register(p)
    return this
  }

  has(code: string): boolean {
    return this.packs.has(code)
  }

  codes(): string[] {
    return [...this.packs.keys()]
  }

  /** 获得已解析回退链的语言视图 */
  get(code: string): ResolvedLanguage {
    let r = this.resolvedCache.get(code)
    if (!r) {
      r = new ResolvedLanguage(code, this.buildChain(code))
      this.resolvedCache.set(code, r)
    }
    return r
  }

  /** 按用户 locale 找最佳匹配 */
  match(userLocale: string): ResolvedLanguage {
    if (this.packs.has(userLocale)) return this.get(userLocale)

    const lang = userLocale.split(/[-_]/)[0]!.toLowerCase()
    for (const code of this.packs.keys()) {
      if (code.split(/[-_]/)[0]!.toLowerCase() === lang) return this.get(code)
    }
    if (this.packs.has('en')) return this.get('en')

    const first = this.packs.keys().next().value
    if (!first) throw new LanguageError('语言注册表为空')
    return this.get(first)
  }

  private buildChain(code: string): LanguagePack[] {
    const chain: LanguagePack[] = []
    const seen = new Set<string>()
    let cur: string | undefined = code
    while (cur && !seen.has(cur)) {
      seen.add(cur)
      const p = this.packs.get(cur)
      if (!p) break
      chain.push(p)
      cur = Array.isArray(p.fallback) ? p.fallback[0] : p.fallback
    }
    if (chain.length === 0 && this.packs.has('en')) {
      chain.push(this.packs.get('en')!)
    }
    return chain
  }
}

/** 已解析回退链的语言视图：查不到就往下找 */
export class ResolvedLanguage {
  constructor(
    readonly code: string,
    private chain: LanguagePack[],
  ) {}

  get displayName(): string {
    return this.chain[0]?.displayName ?? this.code
  }

  unit(id: string): UnitExpression | undefined {
    for (const p of this.chain) if (p.units[id]) return p.units[id]
    return undefined
  }

  prefix(symbol: string): PrefixExpression | undefined {
    for (const p of this.chain) if (p.prefixes?.[symbol]) return p.prefixes[symbol]
    return undefined
  }

  template<K extends keyof LanguageTemplates>(key: K): LanguageTemplates[K] {
    for (const p of this.chain) {
      const v = p.templates?.[key]
      if (v !== undefined) return v as LanguageTemplates[K]
    }
    return DEFAULT_TEMPLATES[key]
  }

  formatNumber(value: number, extra?: Intl.NumberFormatOptions): string {
    let opts: Intl.NumberFormatOptions = { ...extra }
    for (const p of this.chain) {
      if (p.numberFormat) {
        opts = { ...p.numberFormat, ...extra }
        break
      }
    }
    try {
      return new Intl.NumberFormat(this.code, opts).format(value)
    } catch {
      return new Intl.NumberFormat('en', opts).format(value)
    }
  }

  /**
   * 在本语言包内反查单位文本 → { defId, prefix? }。
   * 先尝试“词头 + 单位”（长匹配优先），再尝试“精确匹配单位”。
   */
  lookupUnitText(text: string): UnitTextHit | null {
    // 收集所有可能的词头（跨回退链），按长度降序
    const prefixes: Array<{ symbol: string; texts: string[] }> = []
    for (const p of this.chain) {
      if (!p.prefixes) continue
      for (const [symbol, pe] of Object.entries(p.prefixes)) {
        const texts = [symbol]
        if (pe.symbol && pe.symbol !== symbol) texts.push(pe.symbol)
        if (pe.name) texts.push(pe.name)
        prefixes.push({ symbol, texts })
      }
    }
    // 去重并按长度降序
    const all: Array<{ symbol: string; text: string }> = []
    for (const { symbol, texts } of prefixes) {
      for (const t of texts) all.push({ symbol, text: t })
    }
    all.sort((a, b) => b.text.length - a.text.length)

    // 尝试词头 + 单位
    for (const { symbol, text: pText } of all) {
      if (!text.startsWith(pText)) continue
      const rest = text.slice(pText.length)
      if (!rest) continue
      const defId = this.findUnitId(rest)
      if (defId) return { defId, prefix: symbol }
    }

    // 精确匹配单位（symbol/name/plural/alias）
    const defId = this.findUnitId(text)
    return defId ? { defId } : null
  }

  private findUnitId(text: string): string | null {
    for (const p of this.chain) {
      for (const [id, ue] of Object.entries(p.units)) {
        if (
          ue.symbol === text ||
          ue.name === text ||
          ue.plural === text ||
          ue.aliases?.includes(text)
        ) {
          return id
        }
      }
    }
    return null
  }
}

function validatePack(pack: LanguagePack): void {
  if (!pack.code || typeof pack.code !== 'string') {
    throw new LanguageError('语言包必须包含非空 code')
  }
  if (!pack.displayName) {
    throw new LanguageError(`语言包 "${pack.code}" 缺少 displayName`)
  }
  if (!pack.units || typeof pack.units !== 'object') {
    throw new LanguageError(`语言包 "${pack.code}" 必须包含 units`)
  }
  for (const [id, ue] of Object.entries(pack.units)) {
    if (!ue.symbol || !ue.name) {
      throw new LanguageError(`语言包 "${pack.code}" 的单位 "${id}" 缺少 symbol 或 name`)
    }
  }
  if (pack.fallback) {
    const chain = Array.isArray(pack.fallback) ? pack.fallback : [pack.fallback]
    if (chain.includes(pack.code)) {
      throw new LanguageError(`语言包 "${pack.code}" 的 fallback 不能指向自己`)
    }
  }
}
