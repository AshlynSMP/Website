import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Empty, PlayerHead } from '../../ui';
import { formatDate } from '../../../lib/format.js';
import { fetchChat, sendChat } from '../../../lib/portal.js';
import { PageTitle } from '../shared.jsx';

const POLL_MS = 2000;
const MAX_LENGTH = 200;
const KEEP = 200;

const ERRORS = {
    'too-fast': 'Even rustig aan, je stuurt te snel.',
    'chat-off': 'De chat ligt er nu uit.',
    forbidden: 'Je kunt nu niet chatten.',
    offline: 'De server is niet bereikbaar.'
};

const clock = (time) => formatDate(time, { hour: '2-digit', minute: '2-digit' });

function useChat() {
    const [messages, setMessages] = useState([]);
    const [state, setState] = useState('loading');
    const last = useRef(0);

    const load = useCallback(async () => {
        try {
            const data = await fetchChat(last.current);
            const fresh = data.messages.filter((m) => m.id > last.current);
            if (fresh.length) {
                last.current = fresh[fresh.length - 1].id;
                setMessages((m) => [...m, ...fresh].slice(-KEEP));
            }
            setState('ready');
        } catch {
            setState((s) => (s === 'loading' ? 'error' : s));
        }
    }, []);

    useEffect(() => {
        load();
        const id = setInterval(() => {
            if (!document.hidden) load();
        }, POLL_MS);
        return () => clearInterval(id);
    }, [load]);

    return { messages, state, reload: load };
}

export function Chat() {
    const chat = useChat();
    const [text, setText] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const log = useRef(null);
    const stick = useRef(true);

    useEffect(() => {
        const el = log.current;
        if (el && stick.current) el.scrollTop = el.scrollHeight;
    }, [chat.messages]);

    const onScroll = () => {
        const el = log.current;
        stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    };

    const submit = async (e) => {
        e.preventDefault();
        const message = text.trim();
        if (!message || busy) return;
        setBusy(true);
        setError(null);
        try {
            await sendChat(message);
            setText('');
            stick.current = true;
            await chat.reload();
        } catch (err) {
            setError(ERRORS[err.message] ?? 'Versturen lukt nu niet.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <PageTitle>Chat</PageTitle>
            <p className="muted portal-intro">Wat je hier typt, zien spelers in-game.</p>
            <Card className="portal-chat">
                <ol className="portal-chat-log" ref={log} onScroll={onScroll} aria-live="polite">
                    {chat.messages.length === 0 && (
                        <Empty>{chat.state === 'loading' ? 'Laden…' : chat.state === 'error' ? 'De chat laadt niet.' : 'Nog niks gezegd.'}</Empty>
                    )}
                    {chat.messages.map((m) => (
                        <li key={m.id}>
                            <PlayerHead uuid={m.uuid} name={m.player} size={20} />
                            <p>
                                <strong>{m.player}</strong>
                                {m.web && <span className="portal-chat-web"> (web)</span>}
                                {': '}{m.message}
                            </p>
                            <time dateTime={new Date(m.time).toISOString()}>{clock(m.time)}</time>
                        </li>
                    ))}
                </ol>
                <form className="portal-chat-form" onSubmit={submit}>
                    <input value={text} onChange={(e) => setText(e.target.value)} maxLength={MAX_LENGTH}
                        placeholder="Typ een bericht" aria-label="Bericht" autoComplete="off" />
                    <Button type="submit" disabled={busy || !text.trim()}>Stuur</Button>
                </form>
                {error && <p className="portal-error">{error}</p>}
            </Card>
        </>
    );
}
