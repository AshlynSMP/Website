import { useCallback, useEffect, useState } from 'react';

export function usePortalResource(fetcher, refreshMs) {
    const [state, setState] = useState({ data: null, error: null });

    const load = useCallback(async () => {
        try {
            const data = await fetcher();
            setState({ data, error: null });
        } catch (error) {
            setState((s) => ({ data: s.data, error: error.message }));
        }
    }, [fetcher]);

    useEffect(() => {
        load();
        if (!refreshMs) return;
        const id = setInterval(load, refreshMs);
        return () => clearInterval(id);
    }, [load, refreshMs]);

    return { ...state, reload: load };
}
