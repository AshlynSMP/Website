import { config } from '../config.js';

const LOCALE = 'nl-NL';
const TIME_ZONE = config.timezone;
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const roman = (n) => ROMAN[n] ?? String(n);

export const pad = (n) => String(n).padStart(2, '0');

export const formatNumber = (n) => n.toLocaleString(LOCALE);

export const formatDate = (time, options) => new Date(time).toLocaleString(LOCALE, { timeZone: TIME_ZONE, ...options });

export function parseDate(text, timeZone) {
    const match = text?.match(/^(\d{2})-(\d{2})-(\d{4})(?: (\d{2}):(\d{2}))?$/);
    if (!match) return NaN;
    const [day, month, year, hours, minutes] = match.slice(1).map((part) => Number(part ?? 0));
    const guess = Date.UTC(year, month - 1, day, hours, minutes);
    return guess - zoneOffset(guess, timeZone);
}

function zoneOffset(time, timeZone) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }).formatToParts(time);
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute')) - time;
}

export const formatTime = (time) =>
    new Date(time).toLocaleTimeString(LOCALE, { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', second: '2-digit' });

export function formatPlaytime(minutes) {
    const h = Math.floor(minutes / 60);
    if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}u`;
    return h > 0 ? `${h}u ${minutes % 60}m` : `${minutes}m`;
}

export function splitDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    return {
        days: Math.floor(total / 86400),
        hours: Math.floor(total / 3600) % 24,
        minutes: Math.floor(total / 60) % 60,
        seconds: total % 60
    };
}

export function relative(time) {
    const ms = Date.now() - new Date(time);
    const minutes = Math.round(ms / 60000);
    if (minutes < 60) return minutes <= 1 ? 'zojuist' : `${minutes} minuten geleden`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} uur geleden`;
    const days = Math.round(ms / 86400000);
    if (days <= 0) return 'vandaag';
    if (days === 1) return 'gisteren';
    if (days < 30) return `${days} dagen geleden`;
    const months = Math.round(days / 30);
    if (months < 12) return `${months} ${months === 1 ? 'maand' : 'maanden'} geleden`;
    return `${Math.round(months / 12)} jaar geleden`;
}
