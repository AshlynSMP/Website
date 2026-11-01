import { useCallback, useEffect, useState } from 'react';
import { config } from '../config.js';
import { fetchMe, getToken, handleLoginCallback, signOut } from '../lib/portal.js';

const LINK_POLL_MS = 3000;

export function usePortal() {
    const [state, setState] = useState({ phase: 'loading', me: null, error: null });

    const load = useCallback(async () => {
        if (!getToken()) {
            setState((s) => ({ phase: 'signed-out', me: null, error: s.error }));
            return;
        }
        try {
            const me = await fetchMe();
            setState({ phase: me.linked ? 'linked' : 'unlinked', me, error: null });
        } catch (error) {
            if (error.message === 'unauthorized') setState({ phase: 'signed-out', me: null, error: 'expired' });
            else if (error.message === 'maintenance') setState({ phase: 'maintenance', me: null, error: error.reason });
            else setState((s) => (s.me ? s : { phase: 'signed-out', me: null, error: error.message }));
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const callback = handleLoginCallback();
            if (callback) {
                try {
                    await callback;
                } catch (error) {
                    if (!cancelled) setState({ phase: 'signed-out', me: null, error: error.message });
                    return;
                }
            }
            if (!cancelled) load();
        })();
        return () => {
            cancelled = true;
        };
    }, [load]);

    const waiting = state.phase === 'unlinked' && Boolean(state.me?.code);
    useEffect(() => {
        if (state.phase !== 'linked' && state.phase !== 'maintenance' && !waiting) return;
        const id = setInterval(load, waiting ? LINK_POLL_MS : config.refreshMs);
        return () => clearInterval(id);
    }, [state.phase, waiting, load]);

    const logout = useCallback(() => {
        signOut();
        setState({ phase: 'signed-out', me: null, error: null });
    }, []);

    return { ...state, reload: load, logout };
}
