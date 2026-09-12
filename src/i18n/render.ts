import { applyTemplate } from './types.js'
import type { ResolvedLanguage } from './registry.js'
import type { UnitSource } from '../units/source.js'

export type RenderStyle = 'symbol' | 'name'

/** 把单位的结构描述渲染为指定语言下的文本 */
export function renderUnit(
  src: UnitSource,
  lang: ResolvedLanguage,
  style: RenderStyle = 'symbol',
): string {
  switch (src.kind) {
    case 'base': {
      const ue = lang.unit(src.defId)
      if (!ue) return src.defId // 未翻译 → 回退到 id

      // 无词头
      if (!src.prefix) {
        return style === 'symbol' ? ue.symbol : ue.name
      }

      // 有词头：先查 prefixed 覆盖
      const override = ue.prefixed?.[src.prefix]
      const ov = style === 'symbol' ? override?.symbol : override?.name
      if (ov) return ov

      // 通用拼接：用语言包里的词头表达 + prefixJoin 模板
      const pe = lang.prefix(src.prefix)
      const pText = style === 'symbol' ? (pe?.symbol ?? src.prefix) : (pe?.name ?? src.prefix)
      const uText = style === 'symbol' ? ue.symbol : ue.name

      return applyTemplate(lang.template('prefixJoin'), {
        prefix: pText,
        unit: uText,
      })
    }

    case 'mul':
      return applyTemplate(lang.template('multiply'), {
        left: renderUnit(src.left, lang, style),
        right: renderUnit(src.right, lang, style),
      })

    case 'div':
      return applyTemplate(lang.template('divide'), {
        numerator: renderUnit(src.left, lang, style),
        denominator: renderUnit(src.right, lang, style),
      })

    case 'pow':
      return applyTemplate(lang.template('power'), {
        base: renderUnit(src.base, lang, style),
        exp: src.exp,
      })
  }
}
