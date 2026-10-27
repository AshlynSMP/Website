import { useEffect, useMemo, useState } from 'react';
import { buildSlides } from '../../lib/wrapped.js';
import { ShareButton } from './ShareButton.jsx';
import { ShareSheet } from './ShareSheet.jsx';
import { WrappedSlide } from './WrappedSlide.jsx';
import './Wrapped.css';

const SLIDE_MS = 6000;

export function WrappedStory({ player, players, onClose }) {
    const slides = useMemo(() => buildSlides(player, players), [player, players]);
    const [index, setIndex] = useState(0);
    const [sharing, setSharing] = useState(false);
    const last = index === slides.length - 1;

    const go = (step) => setIndex((i) => Math.max(0, Math.min(slides.length - 1, i + step)));

    useEffect(() => {
        if (last) return;
        const id = setTimeout(() => go(1), SLIDE_MS);
        return () => clearTimeout(id);
    }, [index, last]);

    useEffect(() => {
        if (sharing) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
        };
        addEventListener('keydown', onKey);
        return () => removeEventListener('keydown', onKey);
    }, [onClose, sharing]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    function onClick(e) {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        go(e.clientX - left < width * 0.3 ? -1 : 1);
    }

    return (
        <div className="wrapped-story" role="dialog" aria-label={`Wrapped van ${player.name}`}>
            <div className="wrapped-progress">
                {slides.map((slide, i) => (
                    <span key={slide.id} className={i < index ? 'done' : i === index ? 'active' : ''}>
                        <i key={i === index ? index : undefined} style={{ animationDuration: `${SLIDE_MS}ms` }} />
                    </span>
                ))}
            </div>
            <button type="button" className="wrapped-close" onClick={onClose} aria-label="Sluiten">×</button>
            <div className="wrapped-stage" onClick={onClick}>
                <WrappedSlide key={slides[index].id} slide={slides[index]} accent={index % 4}>
                    {last && <ShareButton onClick={() => setSharing(true)} />}
                </WrappedSlide>
            </div>
            <ShareSheet player={player} open={sharing} onClose={() => setSharing(false)} />
        </div>
    );
}
