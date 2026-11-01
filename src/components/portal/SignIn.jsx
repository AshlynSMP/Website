import logoImg from '../../assets/img/logo.png';
import { Button } from '../ui';
import { config } from '../../config.js';
import { signIn } from '../../lib/portal.js';

const ERRORS = {
    expired: 'Je sessie is verlopen. Log opnieuw in.',
    denied: 'Inloggen geannuleerd.',
    'login-failed': 'Inloggen is mislukt. Probeer het opnieuw.',
    'too-many': 'Te vaak geprobeerd. Wacht even.',
    offline: 'De server is niet bereikbaar.'
};

export function Maintenance({ reason, onLogout }) {
    return (
        <div className="portal-center">
            <div className="portal-signin">
                <a href="/"><img src={logoImg} alt="Ashlyn SMP" className="portal-logo" /></a>
                <h1>Onderhoud</h1>
                <p className="muted">{reason ?? 'Het portaal is even alleen voor de leiders.'}</p>
                <button type="button" className="portal-text-button small" onClick={onLogout}>Uitloggen</button>
            </div>
        </div>
    );
}

export function SignIn({ error }) {
    return (
        <div className="portal-center">
            <div className="portal-signin">
                <a href="/"><img src={logoImg} alt="Ashlyn SMP" className="portal-logo" /></a>
                <h1>Portaal</h1>
                <p className="muted">Log in om je stats, events en account te zien.</p>
                {error && <p className="portal-error" role="alert">{ERRORS[error] ?? ERRORS.offline}</p>}
                <Button onClick={signIn}>Inloggen met Watchdog</Button>
            </div>
        </div>
    );
}
