import type { Dimension } from '../core/dimension.js';
import { dimEqual, dimKey, dimMul, dimPow } from '../core/dimension.js';
import { UnitError } from '../core/errors.js';
import { Unit } from './unit.js';

export function multiplyUnits(a: Unit, b: Unit): Unit {
  if (a.isAffine || b.isAffine) {
    throw new UnitError('带偏移的单位不能参与乘除，请先转换为绝对单位');
  }
  return new Unit(
    { kind: 'mul', left: a.source, right: b.source },
    dimMul(a.dimension, b.dimension, 1),
    a.factor * b.factor,
  );
}

export function divideUnits(a: Unit, b: Unit): Unit {
  if (a.isAffine || b.isAffine) {
    throw new UnitError('带偏移的单位不能参与乘除，请先转换为绝对单位');
  }
  return new Unit(
    { kind: 'div', left: a.source, right: b.source },
    dimMul(a.dimension, b.dimension, -1),
    a.factor / b.factor,
  );
}

export function powerUnit(u: Unit, n: number): Unit {
  if (u.isAffine && n !== 1) {
    throw new UnitError('带偏移的单位不能取幂');
  }
  return new Unit(
    { kind: 'pow', base: u.source, exp: n },
    dimPow(u.dimension, n),
    Math.pow(u.factor, n),
  );
}

/** 量纲兼容性检查 */
export function isCompatible(a: Unit, b: Unit): boolean {
  return dimEqual(a.dimension, b.dimension);
}

/**
 * 数值换算：把 value（以 from 表达）换算为 to 单位的数值。
 * 走“绝对量”路径：base = value * from.factor + from.offset
 *                 result = (base - to.offset) / to.factor
 */
export function convert(value: number, from: Unit, to: Unit): number {
  if (!isCompatible(from, to)) {
    throw new UnitError(
      `量纲不匹配：${dimKey(from.dimension)} ≠ ${dimKey(to.dimension)}`,
    );
  }
  const base = value * from.factor + from.offset;
  return (base - to.offset) / to.factor;
}