import type { LanguagePack } from '../types.js'

export const EN: LanguagePack = {
  code: 'en',
  displayName: 'English',
  units: {
    // SI 基本
    meter: { symbol: 'm', name: 'meter', plural: 'meters' },
    gram: { symbol: 'g', name: 'gram', plural: 'grams' },
    second: { symbol: 's', name: 'second', plural: 'seconds' },
    ampere: { symbol: 'A', name: 'ampere', plural: 'amperes' },
    kelvin: { symbol: 'K', name: 'kelvin' },
    mole: { symbol: 'mol', name: 'mole', plural: 'moles' },
    candela: { symbol: 'cd', name: 'candela' },
    radian: { symbol: 'rad', name: 'radian', plural: 'radians' },

    // 温度
    celsius: { symbol: '°C', name: 'degree Celsius' },
    fahrenheit: { symbol: '°F', name: 'degree Fahrenheit' },

    // SI 派生
    hertz: { symbol: 'Hz', name: 'hertz' },
    newton: { symbol: 'N', name: 'newton', plural: 'newtons' },
    pascal: { symbol: 'Pa', name: 'pascal', plural: 'pascals' },
    joule: { symbol: 'J', name: 'joule', plural: 'joules' },
    watt: { symbol: 'W', name: 'watt', plural: 'watts' },
    coulomb: { symbol: 'C', name: 'coulomb', plural: 'coulombs' },
    volt: { symbol: 'V', name: 'volt', plural: 'volts' },
    ohm: { symbol: 'Ω', name: 'ohm', plural: 'ohms' },
    tesla: { symbol: 'T', name: 'tesla', plural: 'teslas' },

    // 时间
    minute: { symbol: 'min', name: 'minute', plural: 'minutes' },
    hour: { symbol: 'h', name: 'hour', plural: 'hours' },
    day: { symbol: 'd', name: 'day', plural: 'days' },

    // 长度
    inch: { symbol: 'in', name: 'inch', plural: 'inches' },
    foot: { symbol: 'ft', name: 'foot', plural: 'feet' },
    mile: { symbol: 'mi', name: 'mile', plural: 'miles' },

    // 质量
    tonne: { symbol: 't', name: 'tonne', plural: 'tonnes' },
    pound: { symbol: 'lb', name: 'pound', plural: 'pounds' },

    // 体积
    liter: { symbol: 'L', name: 'liter', plural: 'liters' },

    // 信息量
    bit: { symbol: 'bit', name: 'bit', plural: 'bits' },
    byte: { symbol: 'B', name: 'byte', plural: 'bytes' },
  },
  prefixes: {
    Q: { name: 'quetta', symbol: 'Q' },
    R: { name: 'ronna', symbol: 'R' },
    Y: { name: 'yotta', symbol: 'Y' },
    Z: { name: 'zetta', symbol: 'Z' },
    E: { name: 'exa', symbol: 'E' },
    P: { name: 'peta', symbol: 'P' },
    T: { name: 'tera', symbol: 'T' },
    G: { name: 'giga', symbol: 'G' },
    M: { name: 'mega', symbol: 'M' },
    k: { name: 'kilo', symbol: 'k' },
    h: { name: 'hecto', symbol: 'h' },
    da: { name: 'deca', symbol: 'da' },
    d: { name: 'deci', symbol: 'd' },
    c: { name: 'centi', symbol: 'c' },
    m: { name: 'milli', symbol: 'm' },
    µ: { name: 'micro', symbol: 'µ' },
    u: { name: 'micro', symbol: 'µ' },
    n: { name: 'nano', symbol: 'n' },
    p: { name: 'pico', symbol: 'p' },
    f: { name: 'femto', symbol: 'f' },
    a: { name: 'atto', symbol: 'a' },
    z: { name: 'zepto', symbol: 'z' },
    y: { name: 'yocto', symbol: 'y' },

    Ki: { name: 'kibi', symbol: 'Ki' },
    Mi: { name: 'mebi', symbol: 'Mi' },
    Gi: { name: 'gibi', symbol: 'Gi' },
    Ti: { name: 'tebi', symbol: 'Ti' },
    Pi: { name: 'pebi', symbol: 'Pi' },
    Ei: { name: 'exbi', symbol: 'Ei' },
  },
  templates: {
    quantity: '{value} {unit}',
    multiply: '{left}·{right}',
    divide: '{numerator}/{denominator}',
    power: '{base}^{exp}',
    prefixJoin: '{prefix}{unit}',
    dimensionless: 'dimensionless',
  },
  numberFormat: { maximumFractionDigits: 6 },
}
