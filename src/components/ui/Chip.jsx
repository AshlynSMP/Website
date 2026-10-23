import { cx } from '../../lib/cx.js';
import './Chip.css';

export function Chip({ className, children, ...props }) {
    return <span className={cx('chip', className)} {...props}>{children}</span>;
}
