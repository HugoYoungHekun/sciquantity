/**
 * 词头只描述“数值倍数”与“标识符号”，
 * 各语言中的名称（"千"/"kilo"）由语言包提供。
 */
export interface PrefixDef {
  symbol: string;      // 唯一标识，如 'k'、'µ'、'Ki'
  factor: number;      // 数值倍数，如 1e3
  group?: string;      // 词头组：'si' | 'binary' | ...
}

export const SI_PREFIXES: PrefixDef[] = [
  { symbol: 'Q',  factor: 1e30, group: 'si' },
  { symbol: 'R',  factor: 1e27, group: 'si' },
  { symbol: 'Y',  factor: 1e24, group: 'si' },
  { symbol: 'Z',  factor: 1e21, group: 'si' },
  { symbol: 'E',  factor: 1e18, group: 'si' },
  { symbol: 'P',  factor: 1e15, group: 'si' },
  { symbol: 'T',  factor: 1e12, group: 'si' },
  { symbol: 'G',  factor: 1e9,  group: 'si' },
  { symbol: 'M',  factor: 1e6,  group: 'si' },
  { symbol: 'k',  factor: 1e3,  group: 'si' },
  { symbol: 'h',  factor: 1e2,  group: 'si' },
  { symbol: 'da', factor: 1e1,  group: 'si' },
  { symbol: 'd',  factor: 1e-1, group: 'si' },
  { symbol: 'c',  factor: 1e-2, group: 'si' },
  { symbol: 'm',  factor: 1e-3, group: 'si' },
  { symbol: 'µ',  factor: 1e-6, group: 'si' },
  { symbol: 'u',  factor: 1e-6, group: 'si' },   // 常见替代写法
  { symbol: 'n',  factor: 1e-9, group: 'si' },
  { symbol: 'p',  factor: 1e-12, group: 'si' },
  { symbol: 'f',  factor: 1e-15, group: 'si' },
  { symbol: 'a',  factor: 1e-18, group: 'si' },
  { symbol: 'z',  factor: 1e-21, group: 'si' },
  { symbol: 'y',  factor: 1e-24, group: 'si' },
];

export const BINARY_PREFIXES: PrefixDef[] = [
  { symbol: 'Ki', factor: 2 ** 10, group: 'binary' },
  { symbol: 'Mi', factor: 2 ** 20, group: 'binary' },
  { symbol: 'Gi', factor: 2 ** 30, group: 'binary' },
  { symbol: 'Ti', factor: 2 ** 40, group: 'binary' },
  { symbol: 'Pi', factor: 2 ** 50, group: 'binary' },
  { symbol: 'Ei', factor: 2 ** 60, group: 'binary' },
];