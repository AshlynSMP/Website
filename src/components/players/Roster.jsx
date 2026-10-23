import { Card, Chip, PlayerHead } from '../ui';
import { useOpenProfile } from './ProfileContext.jsx';
import { relative } from '../../lib/format.js';

const byRecent = (a, b) => (b.online - a.online) || (b.lastSeen - a.lastSeen);

function RosterPlayer({ player }) {
    const openProfile = useOpenProfile();
    return (
        <li>
            <button className="roster-player" type="button" onClick={() => openProfile(player.name)}>
                <PlayerHead name={player.name} size={48} />
                <span>
                    <span className="name">{player.name}</span>
                    <span className={player.online ? 'seen is-online' : 'seen'}>
                        {player.online ? '● Nu online' : `Gezien ${relative(player.lastSeen)}`}
                    </span>
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
