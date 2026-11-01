import { useState } from 'react';
import { Button, Card } from '../ui';
import { cx } from '../../lib/cx.js';
import { formatNumber, formatPlaytime } from '../../lib/format.js';
import { answerEvent } from '../../lib/portal.js';

const km = (n) => `${n.toLocaleString('nl-NL', { maximumFractionDigits: 1 })} km`;

export const STAT_LABELS = {
    playtimeMinutes: ['Speeltijd', formatPlaytime],
    daysPlayed: ['Dagen gespeeld', formatNumber],
    longestSessionMinutes: ['Langste sessie', formatPlaytime],
    advancements: ['Advancements', formatNumber],
    deaths: ['Deaths', formatNumber],
    mobKills: ['Mob kills', formatNumber],
    playerKills: ['PvP kills', formatNumber],
    distanceKm: ['Gelopen', km],
    blocksMined: ['Blokken gemined', formatNumber],
    jumps: ['Sprongen', formatNumber],
    fishCaught: ['Vissen gevangen', formatNumber],
    animalsBred: ['Dieren gefokt', formatNumber],
    villagerTrades: ['Handel met dorpelingen', formatNumber]
};

export const rankText = (table, key) => {
    const stat = table?.stats?.[key];
    return stat ? `#${stat.rank} van ${table.players}` : null;
};

export const averageText = (table, key) => {
    const stat = table?.stats?.[key];
    return stat ? `gem. ${STAT_LABELS[key][1](Math.round(stat.average * 10) / 10)}` : null;
};

export function PageTitle({ children, aside }) {
    return (
        <div className="portal-title">
            <h1>{children}</h1>
            {aside}
        </div>
    );
}

export function StatTile({ label, value, note, accent }) {
    return (
        <Card className="portal-stat">
            <span>{label}</span>
            <strong>{value}</strong>
            {note && <small className={cx(accent && 'accent')}>{note}</small>}
        </Card>
    );
}

function calendarFile(event) {
    const stamp = (time) => new Date(time).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const text = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ashlyn SMP//Portaal//NL', 'BEGIN:VEVENT',
        `UID:${event.time}@ashlyn-smp`, `DTSTAMP:${stamp(Date.now())}`,
        `DTSTART:${stamp(event.time)}`, `DTEND:${stamp(event.time + (event.liveMs ?? 3 * 3600000))}`,
        `SUMMARY:Ashlyn SMP: ${event.name.replace(/[,;\\]/g, (c) => `\\${c}`)}`,
        'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    return URL.createObjectURL(new Blob([text], { type: 'text/calendar' }));
}

export function useAnswer(onChange) {
    const [busy, setBusy] = useState(false);
    return [busy, async (event, going) => {
        setBusy(true);
        try {
            await answerEvent(event.time, event.answer === going ? null : going);
            await onChange();
        } finally {
            setBusy(false);
        }
    }];
}

export function EventButtons({ event, onChange, full }) {
    const [busy, answer] = useAnswer(onChange);
    const download = () => {
        const url = calendarFile(event);
        const a = Object.assign(document.createElement('a'), { href: url, download: 'ashlyn-event.ics' });
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return (
        <div className="portal-actions">
            <Button variant={event.answer === true ? undefined : 'ghost'} aria-pressed={event.answer === true} disabled={busy} onClick={() => answer(event, true)}>
                {event.answer === true ? '✓ Ik ben erbij' : 'Ik ben erbij'}
            </Button>
            {full && (
                <>
                    <Button variant="ghost" aria-pressed={event.answer === false} disabled={busy} onClick={() => answer(event, false)}>
                        {event.answer === false ? '✓ Kan niet' : 'Kan niet'}
                    </Button>
                    <Button variant="ghost" onClick={download}>Zet in agenda</Button>
                </>
            )}
        </div>
    );
}

export const goingText = (event) => {
    if (!event.goingCount) return 'Nog niemand heeft gereageerd';
    return event.goingCount === 1 ? '1 speler komt' : `${event.goingCount} spelers komen`;
};
