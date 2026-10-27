import { formatDate, formatNumber, formatPlaytime } from './format.js';
import { dimensionLabel } from './game.js';

export async function loadWrapped() {
    const res = await fetch(`${import.meta.env.BASE_URL}wrapped.json`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.players?.length ? data : null;
}

const rank = (players, player, key) =>
    1 + players.filter((p) => (p[key] ?? 0) > (player[key] ?? 0)).length;

const percentBeaten = (players, player, key) => {
    const others = players.filter((p) => p !== player);
    if (others.length === 0) return 0;
    return Math.round((others.filter((p) => (p[key] ?? 0) < (player[key] ?? 0)).length / others.length) * 100);
};

const rankText = (players, player, key) => `#${rank(players, player, key)} van de server`;

export function summaryFacts(player) {
    return [
        ['Speeltijd', formatPlaytime(player.playtimeMinutes)],
        ['Dagen online', formatNumber(player.daysPlayed ?? 0)],
        ['Gestorven', formatNumber(player.deaths)],
        ['Mobs verslagen', formatNumber(player.mobKills)],
        ['Blokken gemined', formatNumber(player.blocksMined)],
        ['Te voet', `${formatNumber(Math.round(player.distanceKm))} km`]
    ];
}

export function highlights(player) {
    const items = [];
    const dimension = favoriteDimension(player.dimensionMinutes);
    if (dimension) items.push(`Favoriete dimensie: ${dimensionLabel(dimension.key)}`);
    const hour = player.hourMinutes && favoriteHour(player.hourMinutes);
    if (hour !== null && hour !== undefined) items.push(`Meestal online rond ${String(hour).padStart(2, '0')}:00`);
    return items;
}

function favoriteHour(hours) {
    const max = Math.max(...hours);
    return max > 0 ? hours.indexOf(max) : null;
}

function favoriteDimension(minutes) {
    const entries = Object.entries(minutes ?? {});
    const total = entries.reduce((sum, [, m]) => sum + m, 0);
    if (total === 0) return null;
    const [key] = entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best));
    return { key, shares: entries.map(([k, m]) => [k, m / total]) };
}

export function buildSlides(player, players) {
    const slides = [{ id: 'intro', label: 'Seizoen II', value: player.name, sub: 'Dit was jouw seizoen.', head: true }];

    const hours = Math.round(player.playtimeMinutes / 60);
    const beaten = percentBeaten(players, player, 'playtimeMinutes');
    slides.push({
        id: 'playtime',
        label: 'Speeltijd',
        value: `${formatNumber(hours)} uur`,
        sub: beaten > 0 ? `Meer dan ${beaten}% van de spelers` : null
    });

    if (player.daysPlayed) {
        slides.push({
            id: 'days',
            label: 'Dagen online',
            value: formatNumber(player.daysPlayed),
            sub: player.longestSessionMinutes ? `Langste sessie: ${formatPlaytime(player.longestSessionMinutes)}` : null
        });
    }

    const hour = player.hourMinutes && favoriteHour(player.hourMinutes);
    if (hour !== null && hour !== undefined) {
        slides.push({ id: 'hours', label: 'Meestal online', value: `rond ${String(hour).padStart(2, '0')}:00`, hours: player.hourMinutes });
    }

    const dimension = favoriteDimension(player.dimensionMinutes);
    if (dimension) {
        slides.push({ id: 'dimension', label: 'Favoriete dimensie', value: dimensionLabel(dimension.key), dimensions: dimension.shares });
    }

    if (player.distanceKm > 0) {
        slides.push({
            id: 'distance',
            label: 'Te voet',
            value: `${formatNumber(Math.round(player.distanceKm))} km`,
            sub: player.jumps ? `${formatNumber(player.jumps)} keer gesprongen` : null
        });
    }

    if (player.blocksMined > 0) {
        slides.push({ id: 'mined', label: 'Blokken gemined', value: formatNumber(player.blocksMined), sub: rankText(players, player, 'blocksMined') });
    }

    slides.push({
        id: 'deaths',
        label: 'Gestorven',
        value: player.deaths === 1 ? '1 keer' : `${formatNumber(player.deaths)} keer`,
        sub: player.deaths === 0 ? 'Geen enkele keer.' : rankText(players, player, 'deaths')
    });

    if (player.mobKills > 0) {
        slides.push({
            id: 'kills',
            label: 'Mobs verslagen',
            value: formatNumber(player.mobKills),
            sub: player.playerKills ? `En ${formatNumber(player.playerKills)} ${player.playerKills === 1 ? 'speler' : 'spelers'}` : null
        });
    }

    if (player.firstAdvancement) {
        slides.push({
            id: 'advancement',
            label: 'Eerste advancement',
            value: `[${player.firstAdvancement.title}]`,
            sub: formatDate(player.firstAdvancement.time, { day: 'numeric', month: 'long', year: 'numeric' }),
            small: true
        });
    }

    slides.push({
        id: 'summary',
        label: 'Seizoen II',
        value: player.name,
        head: true,
        facts: summaryFacts(player)
    });

    return slides;
}

const sum = (players, key) => players.reduce((total, p) => total + (p[key] ?? 0), 0);

export function seasonTotals(players) {
    return [
        ['Spelers', formatNumber(players.length)],
        ['Uur gespeeld', formatNumber(Math.round(sum(players, 'playtimeMinutes') / 60))],
        ['Keer gestorven', formatNumber(sum(players, 'deaths'))],
        ['Mobs verslagen', formatNumber(sum(players, 'mobKills'))],
        ['Blokken gemined', formatNumber(sum(players, 'blocksMined'))],
        ['Km te voet', formatNumber(Math.round(sum(players, 'distanceKm')))]
    ];
}

const HALL_OF_FAME = [
    { key: 'playtimeMinutes', title: 'Meeste speeltijd', format: formatPlaytime },
    { key: 'deaths', title: 'Vaakst gestorven', format: formatNumber },
    { key: 'mobKills', title: 'Meeste mobs', format: formatNumber },
    { key: 'blocksMined', title: 'Meeste blokken', format: formatNumber },
    { key: 'distanceKm', title: 'Verst gelopen', format: (km) => `${formatNumber(Math.round(km))} km` },
    { key: 'playerKills', title: 'Meeste PvP kills', format: formatNumber }
];

export function hallOfFame(players, size = 3) {
    return HALL_OF_FAME
        .map((category) => ({
            ...category,
            top: players
                .filter((p) => (p[category.key] ?? 0) > 0)
                .sort((a, b) => b[category.key] - a[category.key])
                .slice(0, size)
        }))
        .filter((category) => category.top.length > 0);
}
