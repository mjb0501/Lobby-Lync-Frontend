import { useRef, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

//this function allows debounce to work as intended in react
//will cause the provided function to be delayed 500ms
export const useDebounce = (callback: () => void) => {
    const ref = useRef<() => void>();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, 500);
    }, []);

    return debouncedCallback;
}