import { cx } from '../../lib/cx.js';
import './Meter.css';

export function Meter({ value, max, className, title }) {
    const percent = max > 0 ? Math.max(0, Math.min(1, value / max)) * 100 : 0;
    return (
        <div className={cx('meter', className)} title={title}>
            <span style={{ width: `${percent}%` }} />
        </div>
    );
}
