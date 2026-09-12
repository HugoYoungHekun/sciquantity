import type { LanguagePack } from "../types.js";

export const ZH_CN: LanguagePack = {
  code: "zh-CN",
  displayName: "简体中文",
  fallback: "en", // 未翻译项自动走英文

  units: {
    meter: { symbol: "m", name: "米", aliases: ["公尺"] },
    gram: { symbol: "g", name: "克" },
    second: { symbol: "s", name: "秒" },
    ampere: { symbol: "A", name: "安", aliases: ["安培"] },
    kelvin: { symbol: "K", name: "开", aliases: ["开尔文", "开氏度"] },
    mole: { symbol: "mol", name: "摩尔" },
    candela: { symbol: "cd", name: "坎德拉" },
    radian: { symbol: "rad", name: "弧度" },

    celsius: { symbol: "°C", name: "摄氏度" },
    fahrenheit: { symbol: "°F", name: "华氏度" },

    hertz: { symbol: "Hz", name: "赫兹" },
    newton: { symbol: "N", name: "牛", aliases: ["牛顿"] },
    pascal: { symbol: "Pa", name: "帕", aliases: ["帕斯卡"] },
    joule: { symbol: "J", name: "焦", aliases: ["焦耳"] },
    watt: { symbol: "W", name: "瓦", aliases: ["瓦特"] },
    coulomb: { symbol: "C", name: "库仑" },
    volt: { symbol: "V", name: "伏", aliases: ["伏特"] },
    ohm: { symbol: "Ω", name: "欧", aliases: ["欧姆"] },
    tesla: { symbol: "T", name: "特斯拉" },

    minute: { symbol: "min", name: "分", aliases: ["分钟"] },
    hour: { symbol: "h", name: "时", aliases: ["小时"] },
    day: { symbol: "d", name: "天" },

    inch: { symbol: "in", name: "英寸" },
    foot: { symbol: "ft", name: "英尺" },
    mile: { symbol: "mi", name: "英里" },

    tonne: { symbol: "t", name: "吨" },
    pound: { symbol: "lb", name: "磅" },

    liter: { symbol: "L", name: "升" },

    bit: { symbol: "bit", name: "比特" },
    byte: { symbol: "B", name: "字节" },
  },

  prefixes: {
    Q: { name: "昆", symbol: "Q" },
    R: { name: "罗", symbol: "R" },
    Y: { name: "尧", symbol: "Y" },
    Z: { name: "泽", symbol: "Z" },
    E: { name: "艾", symbol: "E" },
    P: { name: "拍", symbol: "P" },
    T: { name: "太", symbol: "T" },
    G: { name: "吉", symbol: "G" },
    M: { name: "兆", symbol: "M" },
    k: { name: "千", symbol: "千" },
    h: { name: "百", symbol: "百" },
    da: { name: "十", symbol: "十" },
    d: { name: "分", symbol: "分" },
    c: { name: "厘", symbol: "厘" },
    m: { name: "毫", symbol: "毫" },
    µ: { name: "微", symbol: "微" },
    u: { name: "微", symbol: "微" },
    n: { name: "纳", symbol: "纳" },
    p: { name: "皮", symbol: "皮" },
    f: { name: "飞", symbol: "飞" },
    a: { name: "阿", symbol: "阿" },
    z: { name: "仄", symbol: "仄" },
    y: { name: "幺", symbol: "幺" },

    Ki: { name: "千二进制", symbol: "Ki" },
    Mi: { name: "兆二进制", symbol: "Mi" },
    Gi: { name: "吉二进制", symbol: "Gi" },
    Ti: { name: "太二进制", symbol: "Ti" },
  },

  templates: {
    quantity: "{value} {unit}",
    multiply: "{left}·{right}",
    divide: "{numerator}每{denominator}", // m/s → 米每秒
    power: "{exp}次方{base}", // m^2 → 米的2次方
    prefixJoin: "{prefix}{unit}", // 千 + 米 = 千米
    dimensionless: "无量纲",
  },

  numberFormat: { maximumFractionDigits: 6 },
};
