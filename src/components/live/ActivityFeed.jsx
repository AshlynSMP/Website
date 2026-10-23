import { Card, Empty, PlayerHead } from '../ui';
import { useOpenProfile } from '../players/ProfileContext.jsx';
import { useNewKeys } from '../../hooks/useNewKeys.js';
import { cx } from '../../lib/cx.js';
import { relative } from '../../lib/format.js';

const ADVANCEMENT_VERBS = { challenge: 'voltooide de uitdaging', goal: 'bereikte het doel' };

const MESSAGES = {
    'join': () => 'kwam online',
    'first-join': () => 'is voor het eerst op de server!',
    'quit': () => 'ging offline',
    'death': () => 'is gestorven',
    'advancement': (e) => (
        <>
            {ADVANCEMENT_VERBS[e.frame] ?? 'behaalde'}{' '}
            <span className="adv" title={e.description ?? ''}>[{e.title}]</span>
        </>
    )
};

function ActivityItem({ event, isNew }) {
    const openProfile = useOpenProfile();
    return (
        <li className={cx('act', event.frame && `frame-${event.frame}`, isNew && 'new')} onClick={() => openProfile(event.player)}>
            <PlayerHead name={event.player} size={48} />
            <span className="text">
                <strong>{event.player}</strong> {MESSAGES[event.type](event)}
            </span>
            <time className="when" dateTime={new Date(event.time).toISOString()}>{relative(event.time)}</time>
        </li>
    );
}

export function ActivityFeed({ events }) {
    const known = events.filter((e) => MESSAGES[e.type]);
    const fresh = useNewKeys(known.map((e) => e.id));

    return (
        <Card className="activity-card" title="Activiteit">
            {known.length > 0 ? (
                <ol className="activity">
                    {known.map((e) => <ActivityItem key={e.id} event={e} isNew={fresh.has(e.id)} />)}
                </ol>
            ) : (
                <Empty>Nog geen activiteit.</Empty>
            )}
        </Card>
    );
}
