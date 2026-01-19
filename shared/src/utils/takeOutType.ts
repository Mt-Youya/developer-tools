export type TakeOut<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>["data"]
