import { useEffect, useState } from 'react';
import { isWhitelistOpen, requestWhitelist } from '../lib/whitelist.js';

export function useWhitelist() {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ status: 'idle', error: null });

    useEffect(() => {
        isWhitelistOpen().then(setOpen).catch(() => setOpen(false));
    }, []);

    async function submit(name, realName) {
        setState({ status: 'sending', error: null });
        try {
            await requestWhitelist(name, realName);
            setState({ status: 'done', error: null });
        } catch (e) {
            setState({ status: 'idle', error: e.message });
        }
    }

    return { open, ...state, submit };
}
