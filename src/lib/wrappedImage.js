import packImg from '../assets/img/pack.png';
import titleImg from '../assets/img/title.png';
import { headUrl } from './game.js';
import { highlights, summaryFacts } from './wrapped.js';

const WIDTH = 1080;
const HEIGHT = 1920;
const PIXEL = '"Silkscreen", monospace';
const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const COLORS = {
    bg: '#110818', card: '#1d0f2a', edge: '#07030b', text: '#f3e9fb', muted: '#b8a3cc', faint: '#8a74a0', gold: '#e8c46a', glow: '#4a1468'
};

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function drawBackground(ctx) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const glow = ctx.createRadialGradient(WIDTH / 2, 420, 0, WIDTH / 2, 420, 900);
    glow.addColorStop(0, COLORS.glow);
    glow.addColorStop(1, 'rgba(74, 20, 104, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < 14; i++) {
        const x = Math.random() * WIDTH;
        const y = HEIGHT * (0.55 + Math.random() * 0.5);
        const r = 220 + Math.random() * 260;
        const puff = ctx.createRadialGradient(x, y, 0, x, y, r);
        puff.addColorStop(0, 'rgba(220, 210, 235, 0.07)');
        puff.addColorStop(1, 'rgba(220, 210, 235, 0)');
        ctx.fillStyle = puff;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
}

function drawCard(ctx, x, y, w, h) {
    ctx.fillStyle = COLORS.edge;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = COLORS.card;
    ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(x + 4, y + 4, w - 8, 4);
    ctx.fillRect(x + 4, y + 4, 4, h - 8);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(x + 4, y + h - 8, w - 8, 4);
    ctx.fillRect(x + w - 8, y + 4, 4, h - 8);
}

function shadowText(ctx, text, x, y, offset) {
    ctx.fillStyle = '#000';
    ctx.fillText(text, x + offset, y + offset);
    ctx.fillStyle = COLORS.text;
    ctx.fillText(text, x, y);
}

function fitFont(ctx, text, family, size, maxWidth) {
    let current = size;
    ctx.font = `${current}px ${family}`;
    while (ctx.measureText(text).width > maxWidth && current > 24) {
        current -= 4;
        ctx.font = `${current}px ${family}`;
    }
}

export async function renderWrappedImage(player) {
    await Promise.all([document.fonts.load(`40px ${PIXEL}`), document.fonts.ready]);
    const [title, pack, head] = await Promise.all([loadImage(titleImg), loadImage(packImg), loadImage(headUrl(player.name, 256))]);

    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    drawBackground(ctx);

    const titleWidth = 900;
    const titleHeight = (title.height / title.width) * titleWidth;
    ctx.drawImage(title, (WIDTH - titleWidth) / 2, 110, titleWidth, titleHeight);

    ctx.font = `44px ${PIXEL}`;
    ctx.fillStyle = COLORS.gold;
    ctx.fillText('WRAPPED', WIDTH / 2, 480);

    const headSize = 280;
    const headX = (WIDTH - headSize) / 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(headX, 540 + 14, headSize, headSize);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(head, headX, 540, headSize, headSize);
    ctx.imageSmoothingEnabled = true;

    fitFont(ctx, player.name.toUpperCase(), PIXEL, 84, WIDTH - 120);
    shadowText(ctx, player.name.toUpperCase(), WIDTH / 2, 950, 6);

    const facts = summaryFacts(player);
    const margin = 80;
    const gap = 30;
    const cardWidth = (WIDTH - margin * 2 - gap) / 2;
    const cardHeight = 180;
    facts.forEach(([label, value], i) => {
        const x = margin + (i % 2) * (cardWidth + gap);
        const y = 1020 + Math.floor(i / 2) * (cardHeight + gap);
        drawCard(ctx, x, y, cardWidth, cardHeight);
        ctx.font = `32px ${SANS}`;
        ctx.fillStyle = COLORS.muted;
        ctx.fillText(label, x + cardWidth / 2, y + 66);
        fitFont(ctx, value, PIXEL, 60, cardWidth - 40);
        shadowText(ctx, value, x + cardWidth / 2, y + 140, 4);
    });

    ctx.font = `32px ${SANS}`;
    ctx.fillStyle = COLORS.muted;
    highlights(player).forEach((line, i) => ctx.fillText(line, WIDTH / 2, 1715 + i * 46));

    const label = location.host || 'smp.ashlyn.nl';
    ctx.font = `34px ${PIXEL}`;
    const iconSize = 56;
    const textWidth = ctx.measureText(label).width;
    const startX = (WIDTH - (iconSize * 1.33 + 20 + textWidth)) / 2;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(pack, startX, 1830, iconSize * 1.33, iconSize);
    ctx.imageSmoothingEnabled = true;
    ctx.textAlign = 'left';
    ctx.fillStyle = COLORS.faint;
    ctx.fillText(label, startX + iconSize * 1.33 + 20, 1870);

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
