export function isJSON(...args: Parameters<JSON["parse"]>) {
  try {
    const json = JSON.parse(...args)
    return json
  } catch (e) {
    console.warn(e)
    return null
  }
}

const _toString = Object.prototype.toString

export function isDefined<T>(val: T): val is NonNullable<T> {
  return !isVoid(val) && !isNull(val)
}

export function isNil(val: unknown): val is undefined | null {
  return val == null
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isNotNull<T>(val: T | null): val is T {
  return val !== null
}

export function isVoid(val: unknown): val is undefined {
  return val === undefined
}

export function isNotVoid<T>(val: T | undefined): val is T {
  return val !== undefined
}

export function isObject(val: unknown): val is object {
  return _toString.call(val) === "[object Object]"
}

export const { isArray } = Array

export function isString(val: unknown): val is string {
  return _toString.call(val) === "[object String]"
}

export function isNumber(val: unknown): val is number {
  return _toString.call(val) === "[object Number]"
}

export function isValueTypeArray(values: unknown[], validator: (v: unknown) => boolean) {
  if (!Array.isArray(values)) {
    return false
  }
  return values.every(validator)
}

export function isStringArray(values: unknown[]): values is string[] {
  return isValueTypeArray(values, isString)
}

export function isNumberArray(values: unknown[]): values is number[] {
  return isValueTypeArray(values, isNumber)
}

export function isEmptyArray(values: unknown) {
  if (!Array.isArray(values)) {
    return false
  }
  return values.length === 0
}

export function isMap<T, K>(val: unknown): val is Map<T, K> {
  return _toString.call(val) === "[object Map]"
}

export function isSet<T>(val: unknown): val is Set<T> {
  return _toString.call(val) === "[object Set]"
}

export function isFunction(val: unknown): val is (...args: unknown[]) => unknown {
  return _toString.call(val) === "[object Function]"
}

export function isBoolean(val: unknown): val is boolean {
  return _toString.call(val) === "[object Boolean]"
}

export function isDate(val: unknown): val is Date {
  return _toString.call(val) === "[object Date]"
}

export function isObjectLike(value: any): value is object {
  return value != null && typeof value === "object"
}
