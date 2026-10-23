import { Card, Empty } from '../ui';
import { useNow } from '../../hooks/useNow.js';
import { formatDate } from '../../lib/format.js';
import { DEFAULT_EVENT_LIVE_MS } from '../../lib/game.js';

const BADGES = { planned: 'Gepland', live: 'Nu bezig' };

function eventState(event, now, liveMs) {
    if (event.time > now) return 'planned';
    return now - event.time < liveMs ? 'live' : 'past';
}

export function Timeline({ events, liveMs = DEFAULT_EVENT_LIVE_MS }) {
    const now = useNow(10000);
    if (events.length === 0) return <Empty>Nog niks gebeurd. Het verhaal moet nog beginnen.</Empty>;

    return (
        <ol className="timeline">
            {events.map((e) => {
                const state = eventState(e, now, liveMs);
                return (
                    <li key={`${e.name}-${e.time}`} className={`tl-item ${state}`}>
                        <Card className="tl-card">
                            <div className="tl-top">
                                <span className="tl-date">
                                    {formatDate(e.time, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                {BADGES[state] && <span className="tl-badge">{BADGES[state]}</span>}
                            </div>
                            <p className="tl-name">{e.name}</p>
                            {e.recap && <p className="tl-recap">{e.recap}</p>}
                        </Card>
                    </li>
                );
            })}
        </ol>
    );
}
