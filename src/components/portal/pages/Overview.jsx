import { Card, Chip, Countdown, Empty, Link, PlayerHead } from '../../ui';
import { formatDate, formatPlaytime, formatNumber, relative, roman } from '../../../lib/format.js';
import { dimensionLabel } from '../../../lib/game.js';
import { averageText, EventButtons, goingText, rankText, StatTile } from '../shared.jsx';

function activityText(item) {
    if (item.type === 'death') return ['✕', 'death', 'Doodgegaan'];
    if (item.type === 'advancement') return ['★', 'advancement', item.title];
    return null;
}

export function Overview({ me, onChange }) {
    const { player, table } = me;
    const season = player.season;

    return (
        <>
            <ProfileCard player={player} leader={me.leader} />
            <div className="portal-stats">
                <StatTile label="Speeltijd" value={formatPlaytime(player.playtimeMinutes ?? 0)} note={rankText(table, 'playtimeMinutes')} accent />
                <StatTile label="Dagen gespeeld" value={formatNumber(season?.daysPlayed ?? 0)} note={rankText(table, 'daysPlayed')} accent />
                <StatTile label="Deaths" value={formatNumber(player.deaths ?? 0)} note={averageText(table, 'deaths')} />
                <StatTile label="Advancements" value={formatNumber(season?.advancements ?? 0)} note={rankText(table, 'advancements')} accent />
            </div>
            <div className="portal-grid">
                <NextEvent event={me.event} onChange={onChange} />
                <Story story={me.story} />
                <Recent player={player} />
                <Online online={me.online ?? []} />
            </div>
        </>
    );
}

function ProfileCard({ player, leader }) {
    const since = player.firstPlayed ? `speelt sinds ${formatDate(player.firstPlayed, { day: 'numeric', month: 'short' })}` : null;
    const about = [player.realName !== player.name && player.realName, since, leader && 'leider'].filter(Boolean).join(' · ');

    return (
        <Card className="portal-profile">
            <PlayerHead uuid={player.uuid} name={player.name} size={80} />
            <div className="portal-who">
                <h1>{player.name}</h1>
                {about && <p className="muted">{about}</p>}
            </div>
            <div className="portal-status">
                {player.live
                    ? <Chip className="is-online">Online · {dimensionLabel(player.live.dimension)}</Chip>
                    : <Chip>Laatst gezien {relative(player.lastSeen)}</Chip>}
                {player.live && (
                    <div className="small muted portal-live">
                        <span>Hart {Math.ceil(player.live.health)}/20</span>
                        <span>Level {player.live.level}</span>
                        <span>Ping {player.live.ping}ms</span>
                    </div>
                )}
            </div>
        </Card>
    );
}

function NextEvent({ event, onChange }) {
    if (!event) {
        return (
            <Card title="Volgend event">
                <Empty>Geen event gepland.</Empty>
            </Card>
        );
    }
    const date = formatDate(event.time, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    return (
        <Card title={event.live ? 'Nu bezig' : 'Volgend event'} aside={<Chip>{date}</Chip>} className="portal-event">
            <p className="portal-event-name">{event.name}</p>
            {!event.live && <Countdown target={event.time} />}
            <div className="portal-event-foot">
                <EventButtons event={event} onChange={onChange} />
                <span className="small muted">{goingText(event)}</span>
            </div>
        </Card>
    );
}

function Story({ story }) {
    const act = story?.acts?.[story.acts.length - 1];
    if (!act) return <Card title="Verhaal"><Empty>Het verhaal begint nog.</Empty></Card>;

    return (
        <Card title="Verhaal" aside={<Chip>Act {roman(story.act)} van {roman(story.total)}</Chip>} className="portal-story">
            <p className="portal-story-title">{act.title}</p>
            {act.info && <p className="muted">{act.info}</p>}
            <ol className="portal-steps" aria-label={`Act ${story.act} van ${story.total}`}>
                {Array.from({ length: story.total }, (_, i) => <li key={i} className={i < story.act ? 'done' : undefined} />)}
            </ol>
        </Card>
    );
}

function Recent({ player }) {
    const items = (player.activity ?? []).map((item) => [item, activityText(item)]).filter(([, text]) => text).slice(0, 4);

    return (
        <Card title="Laatste dingen" aside={<Link href="/portal/stats" className="small">Alle stats</Link>}>
            {items.length === 0 ? (
                <Empty>Nog niks gebeurd.</Empty>
            ) : (
                <ul className="portal-list">
                    {items.map(([item, [mark, type, text]]) => (
                        <li key={item.id}><span><span className={`portal-mark ${type}`}>{mark}</span> {text}</span><span className="muted small">{relative(item.time)}</span></li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

function Online({ online }) {
    return (
        <Card title={`Nu online · ${online.length}`}>
            {online.length === 0 ? (
                <Empty>Niemand online.</Empty>
            ) : (
                <ul className="portal-online">
                    {online.map((p) => (
                        <li key={p.uuid}><PlayerHead uuid={p.uuid} name={p.name} size={28} /><span>{p.name}</span></li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
