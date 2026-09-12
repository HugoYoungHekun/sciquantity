import type { Dimension } from '../core/dimension.js';
import type { UnitSource } from './source.js';
import { sourceId } from './source.js';

/** 单位定义：只描述“物理属性”，不含任何语言文本 */
export interface UnitDef {
  id: string;
  dimension: Dimension;
  /** 换算到基准单位：base = value * factor + offset */
  factor: number;
  /** 仿射单位的偏移（温度），默认 0 */
  offset?: number;
  /** 是否允许加词头，默认 true */
  allowPrefix?: boolean;
  /** 限定的词头组，如 'binary' */
  prefixGroup?: string;
}

/** 单位实例：由 UnitDef + 可选词头，或由运算动态生成 */
export class Unit {
  readonly id: string;
  readonly source: UnitSource;
  readonly dimension: Dimension;
  readonly factor: number;
  readonly offset: number;

  constructor(
    source: UnitSource,
    dimension: Dimension,
    factor: number,
    offset = 0,
  ) {
    this.source = source;
    this.dimension = dimension;
    this.factor = factor;
    this.offset = offset;
    this.id = sourceId(source);
  }

  get isAffine(): boolean {
    return this.offset !== 0;
  }

  get isDimensionless(): boolean {
    return Object.keys(this.dimension).every((k) => this.dimension[k] === 0);
  }

  /** 结构 id 相同即同一单位 */
  equals(o: Unit): boolean {
    return this.id === o.id;
  }
}

/** 由定义 + 可选词头构造一个 Unit */
export function createUnit(
  def: UnitDef,
  prefix?: { symbol: string; factor: number },
): Unit {
  const source: UnitSource = prefix
    ? { kind: 'base', defId: def.id, prefix: prefix.symbol }
    : { kind: 'base', defId: def.id };
  const factor = def.factor * (prefix?.factor ?? 1);
  return new Unit(source, def.dimension, factor, def.offset ?? 0);
}