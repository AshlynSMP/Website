import { useEffect, useRef } from 'react';

const PUFFS = 26;

function createPuffs() {
    return Array.from({ length: PUFFS }, () => ({
        x: Math.random(),
        y: 0.45 + Math.random() * 0.6,
        r: 120 + Math.random() * 220,
        v: (Math.random() * 0.5 + 0.15) * (Math.random() < 0.5 ? -1 : 1) / 1000,
        a: 0.05 + Math.random() * 0.08
    }));
}

export function MistCanvas() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        const puffs = createPuffs();
        let width, height, frame;

        function resize() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            for (const p of puffs) {
                p.x += p.v;
                if (p.x < -0.3) p.x = 1.3;
                if (p.x > 1.3) p.x = -0.3;
                const g = ctx.createRadialGradient(p.x * width, p.y * height, 0, p.x * width, p.y * height, p.r);
                g.addColorStop(0, `rgba(220, 210, 235, ${p.a})`);
                g.addColorStop(1, 'rgba(220, 210, 235, 0)');
                ctx.fillStyle = g;
                ctx.fillRect(p.x * width - p.r, p.y * height - p.r, p.r * 2, p.r * 2);
            }
        }

        function loop() {
            draw();
            frame = requestAnimationFrame(loop);
        }

        resize();
        addEventListener('resize', resize);
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
        else loop();

        return () => {
            removeEventListener('resize', resize);
            cancelAnimationFrame(frame);
        };
    }, []);

    return <canvas ref={ref} className="mist" aria-hidden="true" />;
}
