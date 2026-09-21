# sciquantity

> A flexible, multi-language physical quantity library for TypeScript.
>
> 一个灵活、多语言的 TypeScript 物理量处理库。

**English** · [简体中文](#简体中文)

[![npm version](https://img.shields.io/npm/v/sciquantity?color=blue)](https://www.npmjs.com/package/sciquantity)
[![CI](https://github.com/HugoYoungHekun/sciquantity/actions/workflows/ci.yml/badge.svg)](https://github.com/HugoYoungHekun/sciquantity/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/sciquantity)](./LICENSE)
[![types](https://img.shields.io/npm/types/sciquantity)](https://www.npmjs.com/package/sciquantity)
[![bundle size](https://img.shields.io/bundlephobia/minzip/sciquantity)](https://bundlephobia.com/package/sciquantity)

---

# English

`sciquantity` handles scientific data with **dimension-safe arithmetic**, **arbitrary custom units**, **SI prefixes**, and — uniquely — **declarative multi-language unit expressions**.

Instead of hard-coding `"km/h"` or `"千米每小时"` into your data model, you register a plain-data _language pack_. Physical structure and human language stay completely decoupled.

## Features

- ✅ **Dimension-safe arithmetic** — `length` and `time` are checked automatically; `m + s` throws.
- ✅ **Unit conversion** — linear and affine (℃, ℉, K) with correct offsets.
- ✅ **SI prefixes** — `km`, `MHz`, `µmol`, `KiB` — parsed and rendered out of the box.
- ✅ **Custom units** — register a `UnitDef` and you're done.
- ✅ **Declarative multi-language packs** — pure JSON, no code, translator-friendly.
- ✅ **Fallback chains** — `zh-TW → zh-CN → en` inherits automatically.
- ✅ **Zero runtime dependencies** — only `Intl` from the standard library.
- ✅ **Fully typed** — strict TypeScript with `noUncheckedIndexedAccess`.

## Installation

```bash
npm install sciquantity
```

Requires Node.js 18+ (for `Intl.NumberFormat`, top-level `await`, `node --test`).

## Quick Start

```ts
import {
  createDefaultRegistry,
  LanguageRegistry,
  parseQuantity,
  EN,
  ZH_CN,
} from "sciquantity";

// 1. Set up units and languages
const units = createDefaultRegistry();
const langs = new LanguageRegistry([EN, ZH_CN]);
const zh = langs.get("zh-CN");
const en = langs.get("en");

// 2. Parse and compute
const distance = parseQuantity("100 km", units, zh);
const time = parseQuantity("1.5 h", units, zh);
const speed = distance.div(time);

// 3. Format in any registered language
speed.format({ lang: en });
// → "66.6667 km/h"

speed.format({ lang: zh, style: "name" });
// → "66.6667 千米每小时"

// 4. Convert freely
speed.in(units.parse("m/s", zh));
// → 18.5185...
```

## Core Concepts

The library is organized in three layers, each of which you can extend independently:

| Layer         | Responsibility                              | Key types                                        |
| ------------- | ------------------------------------------- | ------------------------------------------------ |
| **Dimension** | The physics math: `{ length: 1, time: -1 }` | `Dimension`, `dimMul`, `dimPow`                  |
| **Unit**      | Physical definitions and conversion         | `UnitDef`, `Unit`, `UnitSource`, `UnitRegistry`  |
| **i18n**      | Human-readable text in any language         | `LanguagePack`, `ResolvedLanguage`, `renderUnit` |
| **Quantity**  | Value + unit, arithmetic and formatting     | `Quantity`, `parseQuantity`                      |

## Examples

### Temperature (affine units)

```ts
const celsius = parseQuantity("25 °C", units, zh);

celsius.in(units.parse("K", zh)); // 298.15
celsius.in(units.parse("°F", zh)); // 77
```

### Derived units

```ts
const force = parseQuantity("2 kg", units, zh).mul(
  parseQuantity("9.81 m/s^2", units, zh),
);

force.format({ lang: zh, style: "name" });
// → "19.62 千克·米每秒的2次方"

force.in(units.parse("N", zh));
// → 19.62
```

### Scientific notation

```ts
import { Quantity } from "sciquantity";

const avogadro = new Quantity(6.022e23, units.parse("mol^-1", zh));
avogadro.format({
  lang: en,
  numberFormat: { notation: "scientific", maximumFractionDigits: 3 },
});
// → "6.022E23 mol^-1"
```

## Custom Units

Adding a new unit is a one-liner. The physics is all that's needed:

```ts
units.register({
  id: "smoot",
  dimension: { length: 1 },
  factor: 1.7018, // 1 smoot = 1.7018 m
  allowPrefix: false,
});
```

To make it human-readable, add the text to a language pack:

```ts
langs.register({
  code: "zh-CN",
  displayName: "简体中文",
  fallback: "en",
  units: {
    // ...existing entries
    smoot: { symbol: "smoot", name: "斯穆特" },
  },
});
```

## Custom Languages

A language pack is **pure data** — no code, no functions. Translators can maintain it independently.

```ts
langs.register({
  code: "zh-TW",
  displayName: "繁體中文",
  fallback: "zh-CN", // inherits everything not overridden
  units: {
    meter: { symbol: "m", name: "公尺" }, // only override the difference
  },
});
```

### Language Pack Schema

```ts
interface LanguagePack {
  code: string; // BCP 47, required
  displayName: string; // required
  fallback?: string | string[]; // e.g. 'zh-CN' or ['zh-CN', 'en']
  units: Record<string, UnitExpression>;
  prefixes?: Record<string, PrefixExpression>;
  templates?: Partial<LanguageTemplates>;
  numberFormat?: Intl.NumberFormatOptions;
}

interface UnitExpression {
  symbol: string;
  name: string;
  plural?: string;
  aliases?: string[];
  prefixed?: Record<string, { symbol?: string; name?: string }>;
}
```

`templates` control composition layout — here's the Chinese `divide` and `power`:

```ts
templates: {
  quantity:   '{value} {unit}',
  multiply:   '{left}·{right}',
  divide:     '{numerator}每{denominator}',  // m/s → "米每秒"
  power:      '{base}的{exp}次方',            // m^2 → "米的2次方"
  prefixJoin: '{prefix}{unit}',               // 千+米 = 千米
}
```

A LaTeX language pack, for example:

```ts
langs.register({
  code: "math",
  displayName: "Math",
  units: {
    meter: { symbol: "\\mathrm{m}", name: "meter" },
    second: { symbol: "\\mathrm{s}", name: "second" },
  },
  prefixes: { k: { name: "kilo", symbol: "k" } },
  templates: {
    quantity: "{value}\\,{unit}",
    divide: "\\frac{{{numerator}}}{{{denominator}}}",
    power: "{base}^{{{exp}}}",
    prefixJoin: "\\mathrm{{{prefix}}}{unit}",
    multiply: "{left}{right}",
  },
});
```

## API Overview

### UnitRegistry

```ts
class UnitRegistry {
  register(def: UnitDef): this;
  registerMany(defs: UnitDef[]): this;
  usePrefixes(prefixes: PrefixDef[]): this;
  byId(id: string): Unit;
  parse(input: string, lang: ResolvedLanguage): Unit;
}
```

### LanguageRegistry

```ts
class LanguageRegistry {
  register(pack: LanguagePack): this;
  registerMany(packs: LanguagePack[]): this;
  get(code: string): ResolvedLanguage;
  match(userLocale: string): ResolvedLanguage; // best-fit lookup
}
```

### Quantity

```ts
class Quantity {
  readonly value: number;
  readonly unit: Unit;

  to(target: Unit): Quantity;
  in(target: Unit): number;
  add(o: Quantity): Quantity;
  sub(o: Quantity): Quantity;
  mul(o: Quantity): Quantity;
  div(o: Quantity): Quantity;
  pow(n: number): Quantity;
  lt(o: Quantity): boolean;
  gt(o: Quantity): boolean;
  eq(o: Quantity): boolean;
  format(opts: FormatOptions): string;
}
```

See the source for the full API.

## Development

```bash
git clone https://github.com/HugoYoungHekun/sciquantity.git
cd sciquantity
npm install
npm run build
npm test
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Roadmap

- [ ] Auto-prefix selection (`0.000001 m` → `1 µm`)
- [ ] `Quantity` JSON serialization (`toJSON` / `fromJSON`)
- [ ] Plural rules via `Intl.PluralRules` for Slavic / Arabic
- [ ] Compile-time dimension typing with template literal types
- [ ] More built-in packs: `ja`, `de`, `fr`, `es`, `ru`

## License

[MIT](./LICENSE) © sciquantity contributors

---

# 简体中文

`sciquantity` 用于处理科学数据，具备**量纲安全的运算**、**任意自定义单位**、**SI 词头**，以及本库独有的**声明式多语言单位表达**。

不必把 `"km/h"` 或 `"千米每小时"` 硬编码进数据模型——你只需注册一份纯数据的*语言包*，物理结构与人类语言从此彻底解耦。

## 特性

- ✅ **量纲安全运算** — 自动检查 `length`、`time` 等量纲；`m + s` 会直接抛错。
- ✅ **单位换算** — 同时支持线性单位与仿射单位（℃、℉、K），偏移量处理正确。
- ✅ **SI 词头** — `km`、`MHz`、`µmol`、`KiB` 均开箱即用，自动解析与渲染。
- ✅ **自定义单位** — 注册一个 `UnitDef` 即可。
- ✅ **声明式多语言包** — 纯 JSON、不含代码，翻译人员可独立维护。
- ✅ **回退链** — `zh-TW → zh-CN → en` 自动继承未覆盖项。
- ✅ **零运行时依赖** — 仅使用标准库的 `Intl`。
- ✅ **完整类型** — 严格 TypeScript，并开启 `noUncheckedIndexedAccess`。

## 安装

```bash
npm install sciquantity
```

需要 Node.js 18+（用到 `Intl.NumberFormat`、顶层 `await`、`node --test`）。

## 快速开始

```ts
import {
  createDefaultRegistry,
  LanguageRegistry,
  parseQuantity,
  EN,
  ZH_CN,
} from "sciquantity";

// 1. 建立单位与语言系统
const units = createDefaultRegistry();
const langs = new LanguageRegistry([EN, ZH_CN]);
const zh = langs.get("zh-CN");
const en = langs.get("en");

// 2. 解析并计算
const distance = parseQuantity("100 km", units, zh);
const time = parseQuantity("1.5 h", units, zh);
const speed = distance.div(time);

// 3. 用任意已注册的语言渲染
speed.format({ lang: en });
// → "66.6667 km/h"

speed.format({ lang: zh, style: "name" });
// → "66.6667 千米每小时"

// 4. 自由换算
speed.in(units.parse("m/s", zh));
// → 18.5185...
```

## 核心概念

库分为四层，每一层都可以独立扩展：

| 层次               | 职责                                | 关键类型                                         |
| ------------------ | ----------------------------------- | ------------------------------------------------ |
| **量纲 Dimension** | 物理数学：`{ length: 1, time: -1 }` | `Dimension`、`dimMul`、`dimPow`                  |
| **单位 Unit**      | 物理定义与换算                      | `UnitDef`、`Unit`、`UnitSource`、`UnitRegistry`  |
| **多语言 i18n**    | 任意语言下的人类可读文本            | `LanguagePack`、`ResolvedLanguage`、`renderUnit` |
| **数量 Quantity**  | 数值 + 单位，运算与格式化           | `Quantity`、`parseQuantity`                      |

## 示例

### 温度（仿射单位）

```ts
const celsius = parseQuantity("25 °C", units, zh);

celsius.in(units.parse("K", zh)); // 298.15
celsius.in(units.parse("°F", zh)); // 77
```

### 复合单位

```ts
const force = parseQuantity("2 kg", units, zh).mul(
  parseQuantity("9.81 m/s^2", units, zh),
);

force.format({ lang: zh, style: "name" });
// → "19.62 千克·米每秒的2次方"

force.in(units.parse("N", zh));
// → 19.62
```

### 科学计数法

```ts
import { Quantity } from "sciquantity";

const avogadro = new Quantity(6.022e23, units.parse("mol^-1", zh));
avogadro.format({
  lang: en,
  numberFormat: { notation: "scientific", maximumFractionDigits: 3 },
});
// → "6.022E23 mol^-1"
```

## 自定义单位

添加一个新单位只需一行，只写物理定义即可：

```ts
units.register({
  id: "smoot",
  dimension: { length: 1 },
  factor: 1.7018, // 1 smoot = 1.7018 m
  allowPrefix: false,
});
```

要让它可读，再往语言包里补文本即可：

```ts
langs.register({
  code: "zh-CN",
  displayName: "简体中文",
  fallback: "en",
  units: {
    // ...已有条目
    smoot: { symbol: "smoot", name: "斯穆特" },
  },
});
```

## 自定义语言

语言包是**纯数据**——不含代码、不含函数，翻译人员可独立维护。

```ts
langs.register({
  code: "zh-TW",
  displayName: "繁體中文",
  fallback: "zh-CN", // 未覆盖项自动继承
  units: {
    meter: { symbol: "m", name: "公尺" }, // 只覆盖有差异的部分
  },
});
```

### 语言包结构

```ts
interface LanguagePack {
  code: string; // BCP 47 语言代码，必填
  displayName: string; // 必填
  fallback?: string | string[]; // 如 'zh-CN' 或 ['zh-CN', 'en']
  units: Record<string, UnitExpression>;
  prefixes?: Record<string, PrefixExpression>;
  templates?: Partial<LanguageTemplates>;
  numberFormat?: Intl.NumberFormatOptions;
}

interface UnitExpression {
  symbol: string;
  name: string;
  plural?: string;
  aliases?: string[];
  prefixed?: Record<string, { symbol?: string; name?: string }>;
}
```

`templates` 控制复合单位的排版，以下是中文的 `divide` 与 `power`：

```ts
templates: {
  quantity:   '{value} {unit}',
  multiply:   '{left}·{right}',
  divide:     '{numerator}每{denominator}',  // m/s → "米每秒"
  power:      '{base}的{exp}次方',            // m^2 → "米的2次方"
  prefixJoin: '{prefix}{unit}',               // 千+米 = 千米
}
```

再举一个 LaTeX 语言包的例子：

```ts
langs.register({
  code: "math",
  displayName: "Math",
  units: {
    meter: { symbol: "\\mathrm{m}", name: "meter" },
    second: { symbol: "\\mathrm{s}", name: "second" },
  },
  prefixes: { k: { name: "kilo", symbol: "k" } },
  templates: {
    quantity: "{value}\\,{unit}",
    divide: "\\frac{{{numerator}}}{{{denominator}}}",
    power: "{base}^{{{exp}}}",
    prefixJoin: "\\mathrm{{{prefix}}}{unit}",
    multiply: "{left}{right}",
  },
});
```

## API 概览

### UnitRegistry

```ts
class UnitRegistry {
  register(def: UnitDef): this;
  registerMany(defs: UnitDef[]): this;
  usePrefixes(prefixes: PrefixDef[]): this;
  byId(id: string): Unit;
  parse(input: string, lang: ResolvedLanguage): Unit;
}
```

### LanguageRegistry

```ts
class LanguageRegistry {
  register(pack: LanguagePack): this;
  registerMany(packs: LanguagePack[]): this;
  get(code: string): ResolvedLanguage;
  match(userLocale: string): ResolvedLanguage; // 最佳匹配查找
}
```

### Quantity

```ts
class Quantity {
  readonly value: number;
  readonly unit: Unit;

  to(target: Unit): Quantity;
  in(target: Unit): number;
  add(o: Quantity): Quantity;
  sub(o: Quantity): Quantity;
  mul(o: Quantity): Quantity;
  div(o: Quantity): Quantity;
  pow(n: number): Quantity;
  lt(o: Quantity): boolean;
  gt(o: Quantity): boolean;
  eq(o: Quantity): boolean;
  format(opts: FormatOptions): string;
}
```

完整 API 请见源码。

## 开发

```bash
git clone https://github.com/HugoYoungHekun/sciquantity.git
cd sciquantity
npm install
npm run build
npm test
```

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 路线图

- [ ] 自动词头选择（`0.000001 m` → `1 µm`）
- [ ] `Quantity` 的 JSON 序列化（`toJSON` / `fromJSON`）
- [ ] 基于 `Intl.PluralRules` 的复数形式（斯拉夫语、阿拉伯语）
- [ ] 基于模板字面量类型的编译期量纲检查
- [ ] 更多内置语言包：`ja`、`de`、`fr`、`es`、`ru`

## 许可证

[MIT](./LICENSE) © physics-units contributors
