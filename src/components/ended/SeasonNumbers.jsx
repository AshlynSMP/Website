import { Section } from '../ui';
import { seasonTotals } from '../../lib/wrapped.js';
import './Ended.css';

export function SeasonNumbers({ players }) {
    return (
        <Section id="cijfers" title="In cijfers">
            <ul className="season-numbers">
                {seasonTotals(players).map(([label, value]) => (
                    <li key={label}>
                        <span className="num">{value}</span>
                        <span className="cap">{label}</span>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
