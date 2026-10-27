import { Card, PlayerHead, Section } from '../ui';
import { cx } from '../../lib/cx.js';
import { hallOfFame } from '../../lib/wrapped.js';
import './Ended.css';

export function HallOfFame({ players, onOpen }) {
    return (
        <Section id="hall-of-fame" title="Hall of fame" intro="Klik op een speler om de Wrapped te bekijken.">
            <div className="grid hall-of-fame">
                {hallOfFame(players).map((category) => (
                    <Card key={category.key} title={category.title}>
                        <ol className="fame-list">
                            {category.top.map((p, i) => (
                                <li key={p.uuid}>
                                    <button type="button" className={cx('fame-row', `top${i + 1}`)} onClick={() => onOpen(p.name)}>
                                        <span className="rank">{i + 1}</span>
                                        <PlayerHead name={p.name} size={48} />
                                        <span className="name">{p.name}</span>
                                        <span className="value">{category.format(p[category.key])}</span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </Card>
                ))}
            </div>
        </Section>
    );
}
