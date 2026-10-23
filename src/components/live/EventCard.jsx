import { Card, Chip, Countdown } from '../ui';
import { useNow } from '../../hooks/useNow.js';
import { cx } from '../../lib/cx.js';
import { formatDate } from '../../lib/format.js';
import { DEFAULT_EVENT_LIVE_MS } from '../../lib/game.js';

export function EventCard({ event }) {
    const now = useNow();
    const left = event ? event.time - now : -Infinity;
    const none = !event || left < -(event.liveMs ?? DEFAULT_EVENT_LIVE_MS);
    const live = !none && left <= 0;

    const date = !none && (
        <Chip>{formatDate(event.time, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Chip>
    );

    return (
        <Card className={cx('event-card', none && 'none')} title={live ? 'Nu bezig' : 'Volgend event'} aside={date}>
            <p className="event-name">{none ? 'Geen event gepland' : event.name}</p>
            {!none && !live && <Countdown target={event.time} />}
        </Card>
    );
}
