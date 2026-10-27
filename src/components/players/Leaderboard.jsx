import { useState } from 'react';
import { Card, Empty, PlayerHead, Tabs } from '../ui';
import { useOpenProfile } from './ProfileContext.jsx';
import { cx } from '../../lib/cx.js';
import { STATS } from '../../lib/game.js';

const TABS = Object.entries(STATS).map(([key, stat]) => [key, stat.label]);
const SIZE = 10;

function Row({ player, rank, stat, max, animate }) {
    const openProfile = useOpenProfile();
    const value = player[stat] ?? 0;
    return (
        <li className={cx('board-row', rank <= 3 && `top${rank}`, player.out && 'is-out', animate && 'enter')} onClick={() => openProfile(player.name)}>
            <span className="rank">{rank}</span>
            <PlayerHead name={player.name} size={48} />
            <div className="board-body">
                <div className="board-line">
                    <span className="name">{player.name}</span>
                    <span className="value">{STATS[stat].format(value)}</span>
                </div>
                <div className="bar"><span style={{ width: `${(value / max) * 100}%` }} /></div>
            </div>
        </li>
    );
}

export function Leaderboard({ roster }) {
    const [stat, setStat] = useState('playtimeMinutes');
    const [animate, setAnimate] = useState(false);
    const top = [...roster].sort((a, b) => (b[stat] ?? 0) - (a[stat] ?? 0)).slice(0, SIZE);
    const max = Math.max(1, top[0]?.[stat] ?? 1);

    const select = (key) => {
        setStat(key);
        setAnimate(true);
    };

    return (
        <Card className="leaderboard-card" title="Ranglijst" aside={<Tabs options={TABS} value={stat} onChange={select} label="Ranglijst" />}>
            {top.length > 0 ? (
                <ol className="board">
                    {top.map((p, i) => (
                        <Row key={`${stat}-${p.name}`} player={p} rank={i + 1} stat={stat} max={max} animate={animate} />
                    ))}
                </ol>
            ) : (
                <Empty>Nog geen spelers.</Empty>
            )}
        </Card>
    );
}
