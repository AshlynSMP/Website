import { useEffect, useRef } from 'react';

export function useNewKeys(keys) {
    const previous = useRef(null);
    const fresh = previous.current ? new Set(keys.filter((key) => !previous.current.has(key))) : new Set();

    useEffect(() => {
        previous.current = new Set(keys);
    });

    return fresh;
}
