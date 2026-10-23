import { useEffect, useReducer } from 'react';

const MAX_TIMEOUT = 2 ** 31 - 1;

export function useIsBefore(target) {
    const [, recheck] = useReducer((n) => n + 1, 0);
    const left = target - Date.now();

    useEffect(() => {
        if (left <= 0) return;
        const id = setTimeout(recheck, Math.min(left, MAX_TIMEOUT));
        return () => clearTimeout(id);
    });

    return left > 0;
}
