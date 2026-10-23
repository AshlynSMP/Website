import { Section } from '../ui';
import { formatTime } from '../../lib/format.js';
import { hasTowers } from '../../lib/game.js';
import { cx } from '../../lib/cx.js';
import { ActivityFeed } from './ActivityFeed.jsx';
import { EventCard } from './EventCard.jsx';
import { OnlinePlayers } from './OnlinePlayers.jsx';
import { TowersCard } from './TowersCard.jsx';
import './Live.css';

export function LiveSection({ status }) {
    const towers = hasTowers(status);
    const updated = `Bijgewerkt om ${formatTime(status.updated)}`;

    return (
        <Section id="live" title="Live" intro={updated}>
            <div className={cx('grid live-grid', !towers && 'no-towers')}>
                <OnlinePlayers players={status.players} />
                <EventCard event={status.event} />
                {towers && <TowersCard radio={status.radio} />}
                <ActivityFeed events={status.activity ?? []} />
            </div>
        </Section>
    );
}
