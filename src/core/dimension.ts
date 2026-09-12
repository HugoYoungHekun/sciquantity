/**
 * 量纲：基本维度 → 指数。
 * 例：速度 = { length: 1, time: -1 }。
 * 无显式声明的维度即为 0；空对象表示无量纲。
 */
export type Dimension = Record<string, number>;

/** SI 7 个基本维度 + 常见的工程扩展维度 */
export const BASE = {
  LENGTH: 'length',
  MASS: 'mass',
  TIME: 'time',
  CURRENT: 'current',
  TEMPERATURE: 'temperature',
  AMOUNT: 'amount',
  LUMINOUS: 'luminous',
  // 扩展维度（非 SI 基但常被独立建模）
  ANGLE: 'angle',
  INFORMATION: 'information',
} as const;

export type BaseDimension = typeof BASE[keyof typeof BASE];

/** 量纲相乘 / 相除（sign = 1 或 -1），返回新对象 */
export function dimMul(a: Dimension, b: Dimension, sign: 1 | -1 = 1): Dimension {
  const out: Dimension = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const nv = (out[k] ?? 0) + v * sign;
    if (nv === 0) delete out[k];
    else out[k] = nv;
  }
  return out;
}

/** 量纲的整数/小数次幂 */
export function dimPow(a: Dimension, n: number): Dimension {
  const out: Dimension = {};
  for (const [k, v] of Object.entries(a)) {
    const nv = v * n;
    if (nv !== 0) out[k] = nv;
  }
  return out;
}

/** 量纲相等判断（忽略 0 值项） */
export function dimEqual(a: Dimension, b: Dimension): boolean {
  const ka = Object.keys(a).filter((k) => a[k] !== 0);
  const kb = Object.keys(b).filter((k) => b[k] !== 0);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
}

/** 规范字符串表示，用于日志/报错信息 */
export function dimKey(d: Dimension): string {
  const ks = Object.keys(d)
    .filter((k) => d[k] !== 0)
    .sort();
  if (ks.length === 0) return '1';
  return ks.map((k) => `${k}^${d[k]}`).join('·');
}