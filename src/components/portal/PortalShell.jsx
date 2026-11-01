import packImg from '../../assets/img/pack.png';
import { Link, PlayerHead } from '../ui';
import { cx } from '../../lib/cx.js';
import { Icon } from './icons.jsx';

const LINKS = [
    ['/portal', 'Overzicht', 'home'],
    ['/portal/stats', 'Stats', 'stats'],
    ['/portal/events', 'Events', 'events'],
    ['/portal/melden', 'Melden', 'report'],
    ['/portal/account', 'Account', 'account']
];

export function PortalShell({ me, path, children }) {
    const links = me.leader ? [...LINKS, ['/portal/leiders', 'Leiders', 'leaders']] : LINKS;

    return (
        <div className="portal">
            <header className="portal-bar">
                <a className="nav-brand" href="/">
                    <img src={packImg} alt="" />
                    <span>Ashlyn SMP</span>
                </a>
                <Link className="portal-me" href="/portal/account">
                    <span>{me.watchdog.name}</span>
                    <PlayerHead uuid={me.player.uuid} name={me.player.name} size={32} />
                </Link>
            </header>
            <div className="portal-layout">
                <nav className="portal-nav" aria-label="Portaal">
                    {links.map(([href, label, icon]) => (
                        <Link key={href} href={href} className={cx(href === path && 'on', href === '/portal/leiders' && 'is-leaders')} aria-current={href === path ? 'page' : undefined}>
                            <Icon name={icon} />
                            <span>{label}</span>
                            {href === '/portal/leiders' && me.openRequests > 0 && <span className="portal-badge">{me.openRequests}</span>}
                        </Link>
                    ))}
                </nav>
                <main className="portal-main">{children}</main>
            </div>
        </div>
    );
}
