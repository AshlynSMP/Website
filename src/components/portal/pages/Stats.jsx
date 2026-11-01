import { Card, Empty } from '../../ui';
import { cx } from '../../../lib/cx.js';
import { formatPlaytime, pad } from '../../../lib/format.js';
import { dimensionLabel } from '../../../lib/game.js';
import { averageText, PageTitle, rankText, STAT_LABELS, StatTile } from '../shared.jsx';

const TILES = ['playtimeMinutes', 'longestSessionMinutes', 'distanceKm', 'blocksMined', 'mobKills', 'playerKills', 'fishCaught', 'villagerTrades', 'jumps', 'animalsBred', 'deaths', 'advancements'];
const COMPARE = ['playtimeMinutes', 'advancements', 'blocksMined', 'deaths'];
const WORLDS = ['overworld', 'nether', 'end'];

export function Stats({ me }) {
    const { table } = me;

    if (!table) {
        return (
            <>
                <PageTitle>Stats</PageTitle>
                <Card><Empty>Je stats worden nog verzameld. Kijk over een paar minuten opnieuw.</Empty></Card>
            </>
        );
    }

    return (
        <>
            <PageTitle>Stats</PageTitle>
            <div className="portal-stats">
                {TILES.map((key) => (
                    <StatTile key={key} label={STAT_LABELS[key][0]} value={STAT_LABELS[key][1](table.stats[key].value)}
                        note={key === 'deaths' ? averageText(table, key) : rankText(table, key)} accent={key !== 'deaths'} />
                ))}
            </div>
            <Hours minutes={table.hourMinutes} />
            <div className="portal-grid">
                <Worlds minutes={table.dimensionMinutes} />
                <Compare table={table} />
            </div>
        </>
    );
}

function Hours({ minutes }) {
    const max = Math.max(...minutes);
    if (max === 0) return <Card title="Wanneer je speelt"><Empty>Nog niks gemeten.</Empty></Card>;
    const peak = minutes.indexOf(max);
    const hint = `meestal rond ${pad(peak)}:00`;

    return (
        <Card title="Wanneer je speelt" aside={<span className="chip">{hint}</span>}>
            <div className="portal-hours" role="img" aria-label={`Speeltijd per uur, ${hint}`}>
                {minutes.map((m, hour) => (
                    <span key={hour} className={cx(hour === peak && 'peak')} style={{ height: `${Math.max(2, (m / max) * 100)}%` }} title={`${pad(hour)}:00 · ${formatPlaytime(m)}`} />
                ))}
            </div>
            <div className="portal-hours-axis small muted"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div>
        </Card>
    );
}

function Worlds({ minutes }) {
    const total = WORLDS.reduce((sum, w) => sum + (minutes[w] ?? 0), 0);

    return (
        <Card title="Tijd per wereld">
            {total === 0 ? <Empty>Nog niks gemeten.</Empty> : (
                <>
                    <div className="portal-worlds-bar">
                        {WORLDS.map((w) => <span key={w} className={w} style={{ width: `${((minutes[w] ?? 0) / total) * 100}%` }} />)}
                    </div>
                    <ul className="portal-list">
                        {WORLDS.map((w) => (
                            <li key={w}>
                                <span><span className={`portal-swatch ${w}`} />{dimensionLabel(w)}</span>
                                <span className="muted small">{formatPlaytime(minutes[w] ?? 0)} · {Math.round(((minutes[w] ?? 0) / total) * 100)}%</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Card>
    );
}

function Compare({ table }) {
    return (
        <Card title="Jij tegen de rest">
            <ul className="portal-compare">
                {COMPARE.map((key) => {
                    const { value, average } = table.stats[key];
                    const [label, format] = STAT_LABELS[key];
                    const max = Math.max(value, average * 2, 1);
                    return (
                        <li key={key}>
                            <div><span>{label}</span><span className="muted small">{format(value)} · gem. {format(Math.round(average))}</span></div>
                            <div className="portal-compare-bar">
                                <span style={{ width: `${(value / max) * 100}%` }} />
                                <i style={{ left: `${(average / max) * 100}%` }} />
                            </div>
                        </li>
                    );
                })}
            </ul>
            <p className="portal-legend small muted"><span className="you" />jij <span className="avg" />gemiddeld</p>
        </Card>
    );
}
