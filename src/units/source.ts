/**
 * 单位的“结构描述”，与语言完全解耦。
 * 文本渲染交给 i18n/render。
 */
export type UnitSource =
  | { kind: 'base'; defId: string; prefix?: string }
  | { kind: 'mul';  left: UnitSource; right: UnitSource }
  | { kind: 'div';  left: UnitSource; right: UnitSource }
  | { kind: 'pow';  base: UnitSource; exp: number };

/** 为该结构生成一个稳定、唯一的 id（用于内部缓存/调试） */
export function sourceId(src: UnitSource): string {
  switch (src.kind) {
    case 'base':
      return src.prefix ? `${src.prefix}:${src.defId}` : src.defId;
    case 'mul':
      return `(${sourceId(src.left)}·${sourceId(src.right)})`;
    case 'div':
      return `(${sourceId(src.left)}/${sourceId(src.right)})`;
    case 'pow':
      return `(${sourceId(src.base)}^${src.exp})`;
  }
}