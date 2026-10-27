import { formatDate, formatNumber } from '../../lib/format.js';

const DAY = { day: 'numeric', month: 'long', year: 'numeric' };
const DAY_MS = 86400000;

function summary(start, end, players) {
    const items = [];
    if (start) items.push([formatNumber(Math.max(1, Math.round((end - start) / DAY_MS))), 'dagen']);
    if (players) {
        items.push([formatNumber(players.length), 'spelers']);
        const minutes = players.reduce((total, p) => total + (p.playtimeMinutes ?? 0), 0);
        items.push([formatNumber(Math.round(minutes / 60)), 'uur gespeeld']);
    }
    return items;
}

export function SeasonEnded({ start, end, players }) {
    const items = summary(start, end, players);
    return (
        <div className="preseason season-ended-card">
            <span className="preseason-label">Seizoen II</span>
            <span className="season-ended">Afgelopen</span>
            <span className="preseason-date">
                {start ? `${formatDate(start, DAY)} – ${formatDate(end, DAY)}` : formatDate(end, DAY)}
            </span>
            {items.length > 0 && (
                <ul className="season-summary">
                    {items.map(([value, label]) => (
                        <li key={label}><strong>{value}</strong> {label}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
