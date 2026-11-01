import { config } from '../config.js';
import { formatNumber, formatPlaytime } from './format.js';

const DIMENSIONS = { overworld: 'Overworld', nether: 'Nether', end: 'The End' };

export const STATS = {
    playtimeMinutes: { label: 'Speeltijd', format: formatPlaytime },
    deaths: { label: 'Deaths', format: formatNumber },
    mobKills: { label: 'Mob kills', format: formatNumber },
    playerKills: { label: 'PvP kills', format: formatNumber }
};

export const DEFAULT_EVENT_LIVE_MS = 3 * 3600000;

const SIGNALS = { clear: 'Helder', scrambled: 'Storing', offline: 'Stil' };
export const signalLabel = (signal) => SIGNALS[signal] ?? '–';

export const isFinal = (status) => Boolean(status?.story?.final);
export const standing = (roster = []) => roster.filter((p) => !p.out);

export const hasTowers = (status) => (status?.story?.act ?? 0) >= 2 && Boolean(status.radio);

export const dimensionLabel = (dimension) => DIMENSIONS[dimension] ?? dimension;

export const headUrl = ({ uuid, name }) => uuid
    ? `${config.apiUrl}/head/${uuid}.png`
    : `https://mc-heads.net/avatar/${encodeURIComponent(name)}/64`;
export const bodyUrl = ({ uuid, name }) => uuid
    ? `${config.apiUrl}/body/${uuid}.png`
    : `https://mc-heads.net/body/${encodeURIComponent(name)}/240`;
export const headFallbackUrl = ({ uuid }) => uuid ? `https://crafatar.com/avatars/${uuid}?size=128&overlay` : null;
export const bodyFallbackUrl = ({ uuid }) => uuid ? `https://crafatar.com/renders/body/${uuid}?scale=10&overlay` : null;

export function fallbackTo(fallback) {
    return (e) => {
        if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
    };
}
