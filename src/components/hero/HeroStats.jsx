import { hasTowers, isFinal, signalLabel, standing } from '../../lib/game.js';
import { roman } from '../../lib/format.js';

function Stat({ value, label }) {
    return (
        <div className="hero-stat">
            <span className="num">{value}</span>
            <span className="cap">{label}</span>
        </div>
    );
}

function ThirdStat({ status }) {
    const { roster = [], story, radio } = status;
    if (isFinal(status) && roster.length > 0) return <Stat value={`${standing(roster).length}/${roster.length}`} label="Nog over" />;
    if (hasTowers(status)) return <Stat value={signalLabel(radio.signal)} label="Radio signaal" />;
    return <Stat value={story ? roman(story.act) : '–'} label="Act" />;
}

export function HeroStats({ status }) {
    const { players, world } = status;
    return (
        <div className="hero-stats">
            <Stat value={`${players.online}/${players.max}`} label="Spelers online" />
            <Stat value={world?.day ?? '–'} label="Dag in de wereld" />
            <ThirdStat status={status} />
        </div>
    );
}
