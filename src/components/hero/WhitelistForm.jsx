import { useState } from 'react';
import { Button, TextField } from '../ui';
import { useWhitelist } from '../../hooks/useWhitelist.js';
import { NAME_PATTERN } from '../../lib/whitelist.js';
import './WhitelistForm.css';

const ERRORS = {
    'invalid-name': 'Dat is geen geldige Minecraft-naam.',
    'missing-real-name': 'Vul ook je naam in.',
    'already-requested': 'Voor deze naam loopt al een aanvraag.',
    'already-whitelisted': 'Deze naam staat al op de whitelist.',
    'closed': 'Aanmelden is gesloten.',
    'full': 'Aanmelden is gesloten.',
    'too-many': 'Te veel aanvragen. Probeer het later opnieuw.'
};
const FALLBACK_ERROR = 'Aanmelden lukt nu niet. Probeer het later opnieuw.';

export function WhitelistForm() {
    const { open, status, error, submit } = useWhitelist();
    const [name, setName] = useState('');
    const [realName, setRealName] = useState('');
    const [invalid, setInvalid] = useState(null);

    if (!open) return null;

    if (status === 'done') {
        return (
            <div className="whitelist" role="status">
                <span className="whitelist-title">Aanvraag verstuurd</span>
                <p className="whitelist-done">We gaan ernaar kijken.</p>
            </div>
        );
    }

    function onSubmit(e) {
        e.preventDefault();
        const trimmed = name.trim();
        if (!NAME_PATTERN.test(trimmed)) {
            setInvalid('invalid-name');
            return;
        }
        if (!realName.trim()) {
            setInvalid('missing-real-name');
            return;
        }
        setInvalid(null);
        submit(trimmed, realName.trim());
    }

    const message = invalid ? ERRORS[invalid] : error && (ERRORS[error] ?? FALLBACK_ERROR);

    return (
        <form className="whitelist" onSubmit={onSubmit} noValidate>
            <span className="whitelist-title">Meld je aan voor de whitelist</span>
            <div className="whitelist-fields">
                <TextField
                    label="Minecraft-naam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={16}
                    autoComplete="off"
                    spellCheck={false}
                    required
                />
                <TextField
                    label="Je naam"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    maxLength={40}
                    autoComplete="given-name"
                    required
                />
                <Button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Versturen...' : 'Aanmelden'}
                </Button>
            </div>
            {message && <p className="whitelist-error" role="alert">{message}</p>}
        </form>
    );
}
