import { Card, Chip, Empty, Meter, PlayerHead, PlayerTags } from '../ui';
import { useOpenProfile } from '../players/ProfileContext.jsx';
import { useNewKeys } from '../../hooks/useNewKeys.js';
import { cx } from '../../lib/cx.js';
import { dimensionLabel } from '../../lib/game.js';

const pingBars = (ping) => (ping < 80 ? 4 : ping < 150 ? 3 : ping < 300 ? 2 : 1);

function OnlinePlayer({ player, isNew }) {
    const openProfile = useOpenProfile();
    const { name, health = 20, level = 0, ping = 0, dimension = 'overworld' } = player;
    const open = () => openProfile(name);

    return (
        <li
            className={cx('online-player', isNew && 'enter')}
            tabIndex={0}
            onClick={open}
            onKeyDown={(e) => e.key === 'Enter' && open()}
        >
            <PlayerHead name={name} size={96} />
            <div className="op-info">
                <div className="op-top">
                    <span className="name">{name}</span>
                    <PlayerTags leader={player.leader} op={player.op} />
                </div>
                <Meter className="health" value={health} max={20} title={`${health / 2} hartjes`} />
                <div className="op-chips">
                    <Chip className="lvl">Lv {level}</Chip>
                    <Chip className={`dim dim-${dimension}`}>{dimensionLabel(dimension)}</Chip>
                    <Chip className={`ping b${pingBars(ping)}`} title={`${ping} ms`}><i />{ping} ms</Chip>
                </div>
            </div>
        </li>
    );
}

export function OnlinePlayers({ players }) {
    const { online, max, list } = players;
    const fresh = useNewKeys(list.map((p) => p.name));
    const hidden = list.length === 0 ? online : 0;

    return (
        <Card className="players-card" title="Spelers" aside={<Chip>{online} / {max}</Chip>}>
            {list.length > 0 ? (
                <ul className="online-list">
                    {list.map((p) => <OnlinePlayer key={p.name} player={p} isNew={fresh.has(p.name)} />)}
                </ul>
            ) : (
                <Empty>{hidden === 0 ? 'Niemand online.' : `${hidden} ${hidden === 1 ? 'speler' : 'spelers'} online.`}</Empty>
            )}
        </Card>
    );
}
