import { headUrl } from '../../lib/game.js';

export function PlayerHead({ name, size = 48 }) {
    return <img className="head" src={headUrl(name, size)} alt="" loading="lazy" />;
}
