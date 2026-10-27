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

export const headUrl = (name, size) => `https://mc-heads.net/avatar/${encodeURIComponent(name)}/${size}`;
export const bodyUrl = (name, size) => `https://mc-heads.net/body/${encodeURIComponent(name)}/${size}`;
