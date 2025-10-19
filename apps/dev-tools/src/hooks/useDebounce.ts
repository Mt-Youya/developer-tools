/**
 * React防抖Hook
 * @param callback 需要防抖的回调函数
 * @param delay 延迟时间（毫秒），默认300ms
 * @returns 防抖后的函数
 */
export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    return useCallback(
        (...args: Parameters<T>) => {
            // 清除之前的定时器
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // 设置新的定时器
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    )
}
/**
 * 防抖Hook的另一种实现，返回取消函数
 * @param callback 需要防抖的回调函数
 * @param delay 延迟时间（毫秒），默认300ms
 * @returns [防抖函数, 取消函数]
 */
export function useDebounceWithCancel<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 300
): [
        (...args: Parameters<T>) => void,
        () => void
    ] {
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    const debouncedFunction = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    return [debouncedFunction, cancel];
}
