import { useCallback, useEffect, useState } from 'react';
import { loadWrapped } from '../lib/wrapped.js';

const PREFIX = '#wrapped/';

const nameFromHash = () =>
    location.hash.startsWith(PREFIX) ? decodeURIComponent(location.hash.slice(PREFIX.length)) : null;

export function useWrapped({ enabled }) {
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState(nameFromHash);

    useEffect(() => {
        if (!enabled) return;
        loadWrapped().then(setData).catch(() => setData(null));
        const onHash = () => setSelected(nameFromHash());
        addEventListener('hashchange', onHash);
        return () => removeEventListener('hashchange', onHash);
    }, [enabled]);

    const open = useCallback((name) => {
        location.hash = PREFIX + encodeURIComponent(name);
    }, []);

    const close = useCallback(() => {
        history.replaceState(null, '', location.pathname + location.search);
        setSelected(null);
    }, []);

    const shown = enabled ? data : null;
    const player = shown?.players.find((p) => p.name.toLowerCase() === selected?.toLowerCase()) ?? null;
    return { data: shown, player, open, close };
}
