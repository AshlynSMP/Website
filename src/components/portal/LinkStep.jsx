import { useEffect, useRef, useState } from 'react';
import { Button, Card } from '../ui';
import { useNow } from '../../hooks/useNow.js';
import { pad, splitDuration } from '../../lib/format.js';
import { createCode } from '../../lib/portal.js';
import { Icon } from './icons.jsx';

export function LinkStep({ me, onChange, onLogout }) {
    const now = useNow();
    const [busy, setBusy] = useState(false);
    const [failed, setFailed] = useState(false);
    const [copied, setCopied] = useState(false);
    const asked = useRef(false);
    const code = me.code && me.code.expires > now ? me.code : null;

    async function makeCode() {
        setBusy(true);
        setFailed(false);
        try {
            await createCode();
            await onChange();
        } catch {
            setFailed(true);
        } finally {
            setBusy(false);
        }
    }

    useEffect(() => {
        if (asked.current || me.code) return;
        asked.current = true;
        makeCode();
    });

    async function copy() {
        try {
            await navigator.clipboard.writeText(`/koppel ${code.code}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    }

    const left = code && splitDuration(code.expires - now);

    return (
        <div className="portal-center">
            <Card className="portal-link">
                <ol className="portal-steps" aria-label="Stap 2 van 3">
                    <li className="done" />
                    <li className="done" />
                    <li />
                </ol>
                <h1>Koppel je account</h1>
                {code ? (
                    <>
                        <p className="muted">Join de Ashlyn SMP minecraft server en type:</p>
                        <div className="portal-code">
                            <code>/koppel {code.code}</code>
                            <button type="button" onClick={copy} aria-label={copied ? 'Gekopieerd' : 'Kopieer'}>
                                <Icon name={copied ? 'check' : 'copy'} size={18} />
                            </button>
                        </div>
                        <p className="portal-waiting small">Wachten op de server… nog {left.minutes}:{pad(left.seconds)}</p>
                        <p className="small muted">De pagina gaat vanzelf verder als het gelukt is.</p>
                    </>
                ) : (
                    <>
                        <p className="muted">Koppel je Minecraft-account om je stats te zien.</p>
                        {failed && <p className="portal-error" role="alert">Er ging iets mis. Probeer het opnieuw.</p>}
                        <div><Button onClick={makeCode} disabled={busy}>Nieuwe code</Button></div>
                    </>
                )}
                <button type="button" className="portal-text-button small" onClick={onLogout}>Uitloggen ({me.watchdog.name})</button>
            </Card>
        </div>
    );
}
