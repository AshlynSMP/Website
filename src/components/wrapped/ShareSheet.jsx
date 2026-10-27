import { useEffect, useState } from 'react';
import { Dialog } from '../ui';
import { renderWrappedImage } from '../../lib/wrappedImage.js';
import { copyImage, saveImage, shareImage } from '../../lib/share.js';
import './ShareSheet.css';

const FEEDBACK_MS = 1800;

function useWrappedImage(player, open) {
    const [image, setImage] = useState({ blob: null, url: null, failed: false });

    useEffect(() => {
        if (!open) return;
        let url;
        let cancelled = false;
        setImage({ blob: null, url: null, failed: false });
        renderWrappedImage(player)
            .then((blob) => {
                if (cancelled) return;
                url = URL.createObjectURL(blob);
                setImage({ blob, url, failed: false });
            })
            .catch(() => !cancelled && setImage({ blob: null, url: null, failed: true }));
        return () => {
            cancelled = true;
            if (url) URL.revokeObjectURL(url);
        };
    }, [player, open]);

    return image;
}

function Action({ label, done, onClick, primary }) {
    return (
        <button type="button" className={primary ? 'share-action primary' : 'share-action'} onClick={onClick}>
            {done ?? label}
        </button>
    );
}

export function ShareSheet({ player, open, onClose }) {
    const { blob, url, failed } = useWrappedImage(player, open);
    const [feedback, setFeedback] = useState(null);
    const filename = `ashlyn-wrapped-${player.name}.png`;

    useEffect(() => {
        if (!feedback) return;
        const id = setTimeout(() => setFeedback(null), FEEDBACK_MS);
        return () => clearTimeout(id);
    }, [feedback]);

    async function run(key, action) {
        try {
            await action();
            setFeedback({ key, text: 'Gelukt!' });
        } catch (e) {
            if (e.name !== 'AbortError') setFeedback({ key, text: 'Lukt niet' });
        }
    }

    const doneFor = (key) => (feedback?.key === key ? feedback.text : null);

    return (
        <Dialog open={open} onClose={onClose} className="share-sheet" aria-label="Deel je Wrapped">
            <h3>Deel je Wrapped</h3>
            <div className="share-preview">
                {url && <img src={url} alt={`Wrapped van ${player.name}`} />}
                {!url && <span className="muted small">{failed ? 'Afbeelding maken lukte niet.' : 'Afbeelding maken...'}</span>}
            </div>
            {blob && (
                <div className="share-actions">
                    <Action primary label="Delen" done={doneFor('share')} onClick={() => run('share', () => shareImage(blob, filename))} />
                    <Action label="Opslaan" done={doneFor('save')} onClick={() => run('save', () => saveImage(blob, filename))} />
                    <Action label="Kopieer afbeelding" done={doneFor('image')} onClick={() => run('image', () => copyImage(blob))} />
                </div>
            )}
        </Dialog>
    );
}
