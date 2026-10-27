import { Card, Chip, PlayerHead } from '../ui';
import { useOpenProfile } from './ProfileContext.jsx';
import { cx } from '../../lib/cx.js';
import { relative } from '../../lib/format.js';

const byRecent = (a, b) => (Boolean(a.out) - Boolean(b.out)) || (b.online - a.online) || (b.lastSeen - a.lastSeen);

function seenText(player) {
    if (player.out) return `Uitgeschakeld ${relative(player.out)}`;
    return player.online ? '● Nu online' : `Gezien ${relative(player.lastSeen)}`;
}

function RosterPlayer({ player }) {
    const openProfile = useOpenProfile();
    return (
        <li>
            <button className={cx('roster-player', player.out && 'is-out')} type="button" onClick={() => openProfile(player.name)}>
                <PlayerHead name={player.name} size={48} />
                <span>
                    <span className="name">{player.name}</span>
                    <span className={cx('seen', player.online && !player.out && 'is-online')}>{seenText(player)}</span>
                </span>
            </button>
        </li>
    );
}

export function Roster({ roster }) {
    return (
        <Card className="roster-card" title="Alle spelers" aside={<Chip>{roster.length}</Chip>}>
            <ul className="roster">
                {[...roster].sort(byRecent).map((p) => <RosterPlayer key={p.name} player={p} />)}
            </ul>
        </Card>
    );
}
