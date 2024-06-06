import { useEffect, useState } from 'react';

export function useDebounce(value: number, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState<number>(value);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(t);
        };
    }, [value, delay]);
    
    return debouncedValue;
}
