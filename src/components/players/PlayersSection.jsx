import { Section } from '../ui';
import { Leaderboard } from './Leaderboard.jsx';
import { Roster } from './Roster.jsx';
import './Players.css';

export function PlayersSection({ roster }) {
    return (
        <Section id="spelers" title="Spelers" intro="Klik op een speler voor alle stats.">
            <div className="grid players-grid">
                <Leaderboard roster={roster} />
                <Roster roster={roster} />
            </div>
        </Section>
    );
}
