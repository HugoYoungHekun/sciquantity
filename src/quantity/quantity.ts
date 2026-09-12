import { UnitError } from "../core/errors.js";
import { dimKey } from "../core/dimension.js";
import type { ResolvedLanguage } from "../i18n/registry.js";
import { renderUnit, type RenderStyle } from "../i18n/render.js";
import { applyTemplate } from "../i18n/types.js";
import {
  convert,
  divideUnits,
  multiplyUnits,
  powerUnit,
} from "../units/operations.js";
import type { Unit } from "../units/unit.js";

export interface FormatOptions {
  lang: ResolvedLanguage;
  style?: RenderStyle;
  precision?: number;
  numberFormat?: Intl.NumberFormatOptions;
}

export class Quantity {
  constructor(
    public readonly value: number,
    public readonly unit: Unit,
  ) {}

  /* ---------- 换算 ---------- */
  to(target: Unit): Quantity {
    return new Quantity(convert(this.value, this.unit, target), target);
  }

  in(target: Unit): number {
    return convert(this.value, this.unit, target);
  }

  /* ---------- 加减 ---------- */
  private assertCompatible(o: Quantity): void {
    if (!this.unit.equals(o.unit) && !sameDimension(this.unit, o.unit)) {
      throw new UnitError(
        `不能对不同量纲进行加减运算：${dimKey(this.unit.dimension)} vs ${dimKey(o.unit.dimension)}`,
      );
    }
  }

  add(o: Quantity): Quantity {
    this.assertCompatible(o);
    return new Quantity(this.value + o.in(this.unit), this.unit);
  }

  sub(o: Quantity): Quantity {
    this.assertCompatible(o);
    return new Quantity(this.value - o.in(this.unit), this.unit);
  }

  /* ---------- 乘除幂 ---------- */
  mul(o: Quantity): Quantity {
    return new Quantity(this.value * o.value, multiplyUnits(this.unit, o.unit));
  }

  div(o: Quantity): Quantity {
    return new Quantity(this.value / o.value, divideUnits(this.unit, o.unit));
  }

  pow(n: number): Quantity {
    return new Quantity(Math.pow(this.value, n), powerUnit(this.unit, n));
  }

  /* ---------- 比较 ---------- */
  lt(o: Quantity): boolean {
    return this.value < o.in(this.unit);
  }
  gt(o: Quantity): boolean {
    return this.value > o.in(this.unit);
  }
  eq(o: Quantity): boolean {
    return this.value === o.in(this.unit);
  }

  /* ---------- 格式化 ---------- */
  format(opts: FormatOptions): string {
    const { lang, style = "symbol", precision = 6 } = opts;
    const unitText = renderUnit(this.unit.source, lang, style);
    const valueText = lang.formatNumber(this.value, {
      maximumFractionDigits: precision,
      ...opts.numberFormat,
    });
    return applyTemplate(lang.template("quantity"), {
      value: valueText,
      unit: unitText,
    });
  }

  toString(): string {
    return `${this.value} ${this.unit.id}`;
  }
}

function sameDimension(a: Unit, b: Unit): boolean {
  return dimKey(a.dimension) === dimKey(b.dimension);
}
