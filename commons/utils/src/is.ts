export function isJSON(...args: Parameters<JSON['parse']>) {
    try {
        const json = JSON.parse(...args);
        return json;
    } catch (e) {
        console.warn(e);
        return null;
    }
}

const toString = Object.prototype.toString;

export function isObject(val: unknown): val is object {
    return toString.call(val) === '[object Object]';
}

export const { isArray } = Array

export function isString(val: unknown): val is string {
    return toString.call(val) === '[object String]';
}

export function isNumber(val: unknown): val is number {
    return toString.call(val) === '[object Number]';
}

export function isValueTypeArray(values: unknown[], validator: (v: unknown) => boolean) {
    if (!Array.isArray(values)) {
        return false;
    }
    for (const value of values) {
        if (!validator(value)) {
            return false;
        }
    }
    return true;
}

export function isStringArray(values: unknown[]): values is string[] {
    return isValueTypeArray(values, isString);
}

export function isNumberArray(values: unknown[]): values is number[] {
    return isValueTypeArray(values, isNumber);
}

export function isEmptyArray(values: unknown) {
    if (!Array.isArray(values)) {
        return false;
    }
    return values.length === 0;
}

export function isVoid(val: unknown): val is void {
    return val === undefined;
}
