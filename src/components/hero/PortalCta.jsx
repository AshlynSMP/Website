import { config } from '../../config.js';
import { cx } from '../../lib/cx.js';
import { PORTAL_PATH } from '../../lib/navigation.js';
import { Link } from '../ui/Link.jsx';

export function PortalCta({ lead = 'Al aangemeld?', className }) {
    if (!config.portal) return null;
    return (
        <p className={cx('hero-portal', className)}>
            {lead} <Link href={PORTAL_PATH}>Log in op het portaal &rarr;</Link>
        </p>
    );
}
