import { config } from '../../config.js';
import { SECTIONS } from '../../lib/navigation.js';

export function SectionLinks({ className }) {
    return (
        <nav className={className}>
            {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}>{s.label}</a>
            ))}
            {config.mapUrl && <a href={config.mapUrl} target="_blank" rel="noopener noreferrer">Kaart</a>}
        </nav>
    );
}
