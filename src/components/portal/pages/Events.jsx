import { Card, Chip, Empty, PlayerHead } from '../../ui';
import { usePortalResource } from '../../../hooks/usePortalResource.js';
import { formatDate } from '../../../lib/format.js';
import { fetchEvents } from '../../../lib/portal.js';
import { EventButtons, goingText, PageTitle } from '../shared.jsx';

const longDate = (time) => formatDate(time, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export function Events({ onChange }) {
    const events = usePortalResource(fetchEvents, 30000);
    const refresh = async () => {
        await Promise.all([events.reload(), onChange()]);
    };

    if (!events.data) {
        return (
            <>
                <PageTitle>Events</PageTitle>
                <Card><Empty>{events.error ? 'De events laden niet. Probeer het later opnieuw.' : 'Laden…'}</Empty></Card>
            </>
        );
    }

    const [next, ...later] = events.data.upcoming;

    return (
        <>
            <PageTitle>Events</PageTitle>
            {next ? <NextEvent event={next} onChange={refresh} /> : <Card><Empty>Er is nog geen event gepland.</Empty></Card>}
            {later.length > 0 && (
                <Card title="Gepland">
                    <ul className="portal-list portal-planned">
                        {later.map((event) => (
                            <li key={event.time}>
                                <Chip>{longDate(event.time)}</Chip>
                                <span className="portal-planned-name">{event.name}</span>
                                <span className="muted small">{goingText(event)}</span>
                                <EventButtons event={event} onChange={refresh} />
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
            <Card title="Geweest">
                {events.data.past.length === 0 ? <Empty>Nog geen events geweest.</Empty> : (
                    <ol className="portal-timeline">
                        {events.data.past.map((event) => (
                            <li key={event.time}>
                                <div className="portal-timeline-head">
                                    <strong>{event.name}</strong>
                                    <span className="muted small">{formatDate(event.time, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                    {event.attended && <Chip className="is-online">jij was erbij</Chip>}
                                </div>
                                {event.recap && <p className="muted">{event.recap}</p>}
                            </li>
                        ))}
                    </ol>
                )}
            </Card>
        </>
    );
}

function NextEvent({ event, onChange }) {
    const when = event.live ? 'Nu bezig' : `${longDate(event.time)} · over ${inWords(event.time)}`;

    return (
        <Card className="portal-next">
            <div className="portal-next-body">
                <Chip>{when}</Chip>
                <p className="portal-event-name">{event.name}</p>
                <div className="portal-going">
                    {event.going.slice(0, 6).map((p) => <PlayerHead key={p.uuid} uuid={p.uuid} name={p.name} size={28} />)}
                    <span className="small muted">{goingText(event)}</span>
                </div>
            </div>
            <EventButtons event={event} onChange={onChange} full />
        </Card>
    );
}

function inWords(time) {
    const minutes = Math.max(1, Math.round((time - Date.now()) / 60000));
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} uur`;
    const days = Math.round(hours / 24);
    return days === 1 ? '1 dag' : `${days} dagen`;
}
