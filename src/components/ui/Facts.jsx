import { cx } from '../../lib/cx.js';
import './Facts.css';

export function Facts({ items, className }) {
    return (
        <dl className={cx('facts', className)}>
            {items.map(([label, value]) => (
                <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                </div>
            ))}
        </dl>
    );
}
