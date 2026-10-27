import { PlayerHead, Section } from '../ui';
import './Wrapped.css';

export function WrappedSection({ players, onOpen }) {
    const sorted = [...players].sort((a, b) => a.name.localeCompare(b.name));
    return (
        <Section id="wrapped" title="Wrapped" intro="Jouw Seizoen II in een paar kaarten. Kies jezelf.">
            <ul className="wrapped-players">
                {sorted.map((p) => (
                    <li key={p.uuid}>
                        <button type="button" className="wrapped-player" onClick={() => onOpen(p.name)}>
                            <PlayerHead name={p.name} size={64} />
                            <span className="name">{p.name}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
