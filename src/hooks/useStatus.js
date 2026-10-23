import { useEffect, useState } from 'react';
import { config } from '../config.js';

async function fetchStatus() {
    const res = await fetch(config.statusUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(res.status);
    return res.json();
}

export function useStatus({ paused }) {
    const [state, setState] = useState({ status: null, connection: 'loading' });

    useEffect(() => {
        if (paused) return;
        let cancelled = false;

        async function load() {
            try {
                const status = await fetchStatus();
                if (!cancelled) setState({ status, connection: 'online' });
            } catch {
                if (!cancelled) setState({ status: null, connection: 'offline' });
            }
        }

        load();
        const id = setInterval(load, config.refreshMs);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [paused]);

    return state;
}
