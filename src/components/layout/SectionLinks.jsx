import { config } from '../../config.js';
import { PORTAL_PATH, SECTIONS } from '../../lib/navigation.js';
import { Link } from '../ui/Link.jsx';

export function SectionLinks({ className }) {
    return (
        <nav className={className}>
            {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}>{s.label}</a>
            ))}
            {config.mapUrl && <a href={config.mapUrl} target="_blank" rel="noopener noreferrer">Kaart</a>}
            {config.portal && <Link className="nav-portal-link" href={PORTAL_PATH}>Portaal</Link>}
        </nav>
    );
}
