import { cx } from '../../lib/cx.js';
import './Button.css';

export function Button({ href, variant, className, children, ...props }) {
    const classes = cx('btn', variant, className);
    if (href) {
        return <a className={classes} href={href} target="_blank" rel="noopener" {...props}>{children}</a>;
    }
    return <button className={classes} type="button" {...props}>{children}</button>;
}
