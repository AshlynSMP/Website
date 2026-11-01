import { fallbackTo, headFallbackUrl, headUrl } from '../../lib/game.js';

export function PlayerHead({ uuid, name, size = 48 }) {
    const player = { uuid, name };
    return (
        <img className="head" src={headUrl(player)} width={size} height={size} alt="" loading="lazy"
            onError={fallbackTo(headFallbackUrl(player))} />
    );
}
