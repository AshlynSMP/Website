import { hasTowers, signalLabel } from '../../lib/game.js';
import { roman } from '../../lib/format.js';

function Stat({ value, label }) {
    return (
        <div className="hero-stat">
            <span className="num">{value}</span>
            <span className="cap">{label}</span>
        </div>
    );
}

export function HeroStats({ status }) {
    const { players, world, story, radio } = status;
    return (
        <div className="hero-stats">
            <Stat value={`${players.online}/${players.max}`} label="Spelers online" />
            <Stat value={world?.day ?? '–'} label="Dag in de wereld" />
            {hasTowers(status)
                ? <Stat value={signalLabel(radio.signal)} label="Radio signaal" />
                : <Stat value={story ? roman(story.act) : '–'} label="Act" />}
        </div>
    );
}
