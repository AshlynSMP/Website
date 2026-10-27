import { Dialog, Facts, PlayerTags } from '../ui';
import { cx } from '../../lib/cx.js';
import { formatDate, relative } from '../../lib/format.js';
import { bodyUrl, dimensionLabel, STATS } from '../../lib/game.js';
import './ProfileDialog.css';

function findPlayer(status, name) {
    const online = status?.players?.list?.find((p) => p.name === name);
    const player = status?.roster?.find((p) => p.name === name) ?? online;
    return player && { ...player, online: Boolean(player.online || online), live: online };
}

function seenText(player) {
    if (player.out) return `Uitgeschakeld ${relative(player.out)}`;
    const seen = player.online ? 'Nu online' : `Laatst gezien ${relative(player.lastSeen)}`;
    if (!player.firstPlayed) return seen;
    return `${seen} · speelt sinds ${formatDate(player.firstPlayed, { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function statRows(player) {
    const rows = Object.entries(STATS).map(([key, stat]) => [stat.label, stat.format(player[key] ?? 0)]);
    if (player.live) rows.push(['Nu in', dimensionLabel(player.live.dimension)], ['Level', player.live.level]);
    return rows;
}

export function ProfileDialog({ status, name, onClose }) {
    const player = name && findPlayer(status, name);

    return (
        <Dialog open={Boolean(player)} onClose={onClose} className={cx('profile', player?.out && 'is-out')}>
            {player && (
                <div className="profile-body">
                    <img className="profile-skin" src={bodyUrl(player.name, 240)} alt="" />
                    <div className="profile-info">
                        <h3>{player.name}</h3>
                        <PlayerTags op={player.live?.op} />
                        <p className="muted small profile-seen">{seenText(player)}</p>
                        <Facts items={statRows(player)} />
                    </div>
                </div>
            )}
        </Dialog>
    );
}
