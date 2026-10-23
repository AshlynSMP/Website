import { config } from '../config.js';

const URL = () => `${config.apiUrl}/whitelist`;

export const NAME_PATTERN = /^[A-Za-z0-9_]{3,16}$/;

export async function isWhitelistOpen() {
    const res = await fetch(URL(), { cache: 'no-store' });
    if (!res.ok) return false;
    return (await res.json()).open === true;
}

export async function requestWhitelist(name, realName) {
    const res = await fetch(URL(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, realName })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error ?? 'unavailable');
}
