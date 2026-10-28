import { useState } from 'react';
import { sendReport } from '../lib/report.js';

export function useReport() {
    const [state, setState] = useState({ status: 'idle', error: null });

    async function submit(report) {
        setState({ status: 'sending', error: null });
        try {
            await sendReport(report);
            setState({ status: 'done', error: null });
        } catch (e) {
            setState({ status: 'idle', error: e.message });
        }
    }

    const reset = () => setState({ status: 'idle', error: null });

    return { ...state, submit, reset };
}
