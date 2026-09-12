import { BASE } from '../core/dimension.js';
import { SI_PREFIXES, BINARY_PREFIXES } from './prefixes.js';
import { UnitRegistry } from './registry.js';

export function createDefaultRegistry(): UnitRegistry {
  const r = new UnitRegistry();
  r.usePrefixes(SI_PREFIXES.map((p) => ({ ...p, group: 'si' })));
  r.usePrefixes(BINARY_PREFIXES.map((p) => ({ ...p, group: 'binary' })));

  r.registerMany([
    // ---- SI 基本 ----
    { id: 'meter',   dimension: { [BASE.LENGTH]: 1 },      factor: 1 },
    { id: 'gram',    dimension: { [BASE.MASS]: 1 },        factor: 1e-3 },
    { id: 'second',  dimension: { [BASE.TIME]: 1 },        factor: 1 },
    { id: 'ampere',  dimension: { [BASE.CURRENT]: 1 },     factor: 1 },
    { id: 'kelvin',  dimension: { [BASE.TEMPERATURE]: 1 }, factor: 1 },
    { id: 'mole',    dimension: { [BASE.AMOUNT]: 1 },      factor: 1 },
    { id: 'candela', dimension: { [BASE.LUMINOUS]: 1 },    factor: 1 },
    { id: 'radian',  dimension: {},                        factor: 1 },

    // ---- 温度（仿射，禁止词头） ----
    { id: 'celsius',    dimension: { [BASE.TEMPERATURE]: 1 },
      factor: 1, offset: 273.15, allowPrefix: false },
    { id: 'fahrenheit', dimension: { [BASE.TEMPERATURE]: 1 },
      factor: 5 / 9, offset: 273.15 - (32 * 5) / 9, allowPrefix: false },

    // ---- SI 派生 ----
    { id: 'hertz',  dimension: { [BASE.TIME]: -1 }, factor: 1 },
    { id: 'newton', dimension: {
        [BASE.MASS]: 1, [BASE.LENGTH]: 1, [BASE.TIME]: -2 }, factor: 1 },
    { id: 'pascal', dimension: {
        [BASE.MASS]: 1, [BASE.LENGTH]: -1, [BASE.TIME]: -2 }, factor: 1 },
    { id: 'joule',  dimension: {
        [BASE.MASS]: 1, [BASE.LENGTH]: 2, [BASE.TIME]: -2 }, factor: 1 },
    { id: 'watt',   dimension: {
        [BASE.MASS]: 1, [BASE.LENGTH]: 2, [BASE.TIME]: -3 }, factor: 1 },
    { id: 'coulomb', dimension: { [BASE.CURRENT]: 1, [BASE.TIME]: 1 }, factor: 1 },
    { id: 'volt',   dimension: {
        [BASE.MASS]: 1, [BASE.LENGTH]: 2, [BASE.TIME]: -3,
        [BASE.CURRENT]: -1 }, factor: 1 },
    { id: 'ohm',    dimension: {
        [BASE.MASS]: 1, [BASE.LENGTH]: 2, [BASE.TIME]: -3,
        [BASE.CURRENT]: -2 }, factor: 1 },
    { id: 'tesla',  dimension: {
        [BASE.MASS]: 1, [BASE.TIME]: -2, [BASE.CURRENT]: -1 }, factor: 1 },

    // ---- 时间 ----
    { id: 'minute', dimension: { [BASE.TIME]: 1 }, factor: 60,    allowPrefix: false },
    { id: 'hour',   dimension: { [BASE.TIME]: 1 }, factor: 3600,  allowPrefix: false },
    { id: 'day',    dimension: { [BASE.TIME]: 1 }, factor: 86400, allowPrefix: false },

    // ---- 长度 ----
    { id: 'inch', dimension: { [BASE.LENGTH]: 1 }, factor: 0.0254,     allowPrefix: false },
    { id: 'foot', dimension: { [BASE.LENGTH]: 1 }, factor: 0.3048,     allowPrefix: false },
    { id: 'mile', dimension: { [BASE.LENGTH]: 1 }, factor: 1609.344,   allowPrefix: false },

    // ---- 质量 ----
    { id: 'tonne', dimension: { [BASE.MASS]: 1 }, factor: 1000,          allowPrefix: false },
    { id: 'pound', dimension: { [BASE.MASS]: 1 }, factor: 0.45359237,    allowPrefix: false },

    // ---- 体积 ----
    { id: 'liter', dimension: { [BASE.LENGTH]: 3 }, factor: 1e-3 },

    // ---- 信息量 ----
    { id: 'bit',  dimension: { [BASE.INFORMATION]: 1 }, factor: 1,
      prefixGroup: 'binary' },
    { id: 'byte', dimension: { [BASE.INFORMATION]: 1 }, factor: 8,
      prefixGroup: 'binary' },
  ]);

  return r;
}