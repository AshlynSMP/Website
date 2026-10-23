import { useEffect, useState } from 'react';
import { useNow } from '../../hooks/useNow.js';
import { pad, splitDuration } from '../../lib/format.js';
import './Countdown.css';

const UNITS = [['days', 'dagen'], ['hours', 'uur'], ['minutes', 'min'], ['seconds', 'sec']];
const UNKNOWN = UNITS.map(() => '??');

function CountdownBoxes({ values }) {
    return (
        <div className="countdown">
            {UNITS.map(([unit, label], i) => (
                <div key={unit}>
                    <span>{values[i]}</span>
                    <small>{label}</small>
                </div>
            ))}
        </div>
    );
}

export function Countdown({ target }) {
    const now = useNow();
    const parts = splitDuration(target - now);
    return <CountdownBoxes values={UNITS.map(([unit]) => pad(parts[unit]))} />;
}

const randomDigits = () => pad(Math.floor(Math.random() * 100));

export function ScrambledCountdown() {
    const [values, setValues] = useState(UNKNOWN);

    useEffect(() => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = setInterval(() => {
            const glitch = Math.random() < 0.35 ? Math.floor(Math.random() * UNITS.length) : -1;
            setValues(UNKNOWN.map((value, i) => (i === glitch ? randomDigits() : value)));
        }, 140);
        return () => clearInterval(id);
    }, []);

    return <CountdownBoxes values={values} />;
}
