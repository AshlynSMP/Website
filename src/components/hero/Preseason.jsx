import { Countdown, GlitchText, ScrambledCountdown } from '../ui';
import { formatDate } from '../../lib/format.js';

export function Preseason({ start }) {
    return (
        <div className="preseason">
            <span className="preseason-label"><GlitchText text="Seizoen II begint over" chance={0.06} /></span>
            {start ? <Countdown target={start} /> : <ScrambledCountdown />}
            {start && (
                <span className="preseason-date">
                    {formatDate(start, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </span>
            )}
        </div>
    );
}
