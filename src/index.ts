/* ========== core ========== */
export { UnitError, LanguageError } from './core/errors.js';
export {
  BASE,
  dimEqual,
  dimKey,
  dimMul,
  dimPow,
} from './core/dimension.js';
export type { Dimension, BaseDimension } from './core/dimension.js';

/* ========== units ========== */
export { SI_PREFIXES, BINARY_PREFIXES } from './units/prefixes.js';
export type { PrefixDef } from './units/prefixes.js';

export type { UnitSource } from './units/source.js';
export { sourceId } from './units/source.js';

export { Unit, createUnit } from './units/unit.js';
export type { UnitDef } from './units/unit.js';

export {
  convert,
  divideUnits,
  isCompatible,
  multiplyUnits,
  powerUnit,
} from './units/operations.js';

export { UnitRegistry } from './units/registry.js';
export { createDefaultRegistry } from './units/defaults.js';

/* ========== i18n ========== */
export {
  DEFAULT_TEMPLATES,
  applyTemplate,
} from './i18n/types.js';
export type {
  LanguagePack,
  LanguageTemplates,
  PrefixExpression,
  UnitExpression,
} from './i18n/types.js';

export { LanguageRegistry, ResolvedLanguage } from './i18n/registry.js';
export type { UnitTextHit } from './i18n/registry.js';

export { renderUnit } from './i18n/render.js';
export type { RenderStyle } from './i18n/render.js';

export { EN, ZH_CN } from './i18n/packs/index.js';

/* ========== quantity ========== */
export { Quantity } from './quantity/quantity.js';
export type { FormatOptions } from './quantity/quantity.js';
export { parseQuantity } from './quantity/parse.js';