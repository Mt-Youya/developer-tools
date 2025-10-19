export type RestParameters<T extends (...args: any[]) => any> = T extends (first: any, ...rest: infer R) => any ? R : never;

export type Tail<T extends readonly any[]> = T extends readonly [any, ...infer Rest] ? Rest : never;

export type TailRestParameters<T extends (...args: any[]) => any> = Tail<Parameters<T>>;

export type Writeable<T> = {
    -readonly [P in keyof T]: T[P]
};

export type Required<T> = {
    [P in keyof T]-?: T[P];
};

export type CanWrite<T> = {
    -readonly [K in keyof T]: T[K] extends Record<any, any> ? CanWrite<T[K]> : T[K]
}

export type PromiseReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>

// export type ExtractMap<T> = T extends Map<string, infer U>
//     ? U extends (infer V)[]
//         ? V
//         : never
//     : never;
export type ExtractMap<T> = T extends Map<string, infer U> ? U : never;
