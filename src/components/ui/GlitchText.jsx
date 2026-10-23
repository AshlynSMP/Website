import { useEffect, useState } from 'react';

const GLYPHS = '#%&@$!?<>/=+*0123456789';

function scramble(text) {
    const chars = [...text];
    const hits = 1 + Math.floor(Math.random() * 3);
    for (let n = 0; n < hits; n++) {
        const i = Math.floor(Math.random() * chars.length);
        if (chars[i] !== ' ') chars[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    return chars.join('');
}

export function GlitchText({ text, chance = 0.12 }) {
    const [shown, setShown] = useState(text);

    useEffect(() => {
        setShown(text);
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = setInterval(() => setShown(Math.random() < chance ? scramble(text) : text), 120);
        return () => clearInterval(id);
    }, [text, chance]);

    return <span aria-label={text}>{shown}</span>;
}
