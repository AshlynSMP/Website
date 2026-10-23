import { cx } from '../../lib/cx.js';
import './Card.css';

export function Card({ title, aside, className, children, ...props }) {
    return (
        <article className={cx('card', className)} {...props}>
            {title && (
                <header>
                    <h3>{title}</h3>
                    {aside}
                </header>
            )}
            {children}
        </article>
    );
}
