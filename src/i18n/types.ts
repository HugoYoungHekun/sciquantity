/** 单位在某语言中的表达 */
export interface UnitExpression {
  symbol: string;
  name: string;
  plural?: string; // 复数形式
  aliases?: string[]; // 别名
  /**
   * 针对特定词头 symbol 的覆盖表达。
   * 用于处理不规则拼接，如英文 micro + meter → µm / micrometer
   */
  prefixed?: Record<string, { symbol?: string; name?: string }>;
}

/** 词头在某语言中的表达 */
export interface PrefixExpression {
  name: string;
  symbol?: string;
}

/** 组合模板：纯字符串 + {占位符} */
export interface LanguageTemplates {
  quantity: string;
  multiply: string;
  divide: string;
  power: string;
  prefixJoin: string;
  dimensionless: string;
}

export const DEFAULT_TEMPLATES: LanguageTemplates = {
  quantity: "{value} {unit}",
  multiply: "{left}·{right}",
  divide: "{numerator}/{denominator}",
  power: "{base}^{exp}",
  prefixJoin: "{prefix}{unit}",
  dimensionless: "1",
};

/**
 * 语言包：用户唯一需要理解、填写的固定格式。
 * 所有字段都是纯数据，可以直接 JSON 化。
 */
export interface LanguagePack {
  /** 必填：BCP 47 语言代码 */
  code: string;
  /** 必填：本语言的自称 */
  displayName: string;
  /** 可选：回退链（字符串或数组） */
  fallback?: string | string[];
  /** 必填：单位表达表，key 必须与 UnitDef.id 对应 */
  units: Record<string, UnitExpression>;
  /** 可选：词头表达表，key 为词头 symbol */
  prefixes?: Record<string, PrefixExpression>;
  /** 可选：排版模板 */
  templates?: Partial<LanguageTemplates>;
  /** 可选：透传给 Intl.NumberFormat */
  numberFormat?: Intl.NumberFormatOptions;
}

/** 无依赖、无 eval 的占位符替换 */
export function applyTemplate(
  tpl: string,
  vars: Record<string, string | number>,
): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
