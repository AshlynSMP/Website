import { useEffect } from 'react';
import '../styles/glitch-storm.css';

const STORM_MS = 1800;

function afterPageLoad(callback) {
    if (document.readyState === 'complete') {
        callback();
        return () => {};
    }
    addEventListener('load', callback, { once: true });
    return () => removeEventListener('load', callback);
}

export function useGlitchStorm() {
    useEffect(() => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let stop;
        const cancelLoad = afterPageLoad(() => {
            document.body.classList.add('glitch-storm');
            stop = setTimeout(() => document.body.classList.remove('glitch-storm'), STORM_MS);
        });

        return () => {
            cancelLoad();
            clearTimeout(stop);
            document.body.classList.remove('glitch-storm');
        };
    }, []);
}
