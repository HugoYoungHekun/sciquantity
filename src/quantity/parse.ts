import { UnitError } from '../core/errors.js';
import type { ResolvedLanguage } from '../i18n/registry.js';
import type { UnitRegistry } from '../units/registry.js';
import { Quantity } from './quantity.js';

/** 从字符串解析数量："5 km/h"、"3.2e-3 mol/L"、"25 °C" */
export function parseQuantity(
  input: string,
  units: UnitRegistry,
  lang: ResolvedLanguage,
): Quantity {
  const m = input.trim().match(
    /^([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)\s*(.*)$/,
  );
  if (!m) throw new UnitError(`无法解析数量：${input}`);

  const value = parseFloat(m[1]!);
  const unitStr = m[2]!.trim();
  if (!unitStr) throw new UnitError(`数量缺少单位：${input}`);

  return new Quantity(value, units.parse(unitStr, lang));
}