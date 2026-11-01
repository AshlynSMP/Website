import { Empty } from '../ui';
import { usePortal } from '../../hooks/usePortal.js';
import { LinkStep } from './LinkStep.jsx';
import { PortalShell } from './PortalShell.jsx';
import { Maintenance, SignIn } from './SignIn.jsx';
import { Account } from './pages/Account.jsx';
import { Events } from './pages/Events.jsx';
import { Leaders } from './pages/Leaders.jsx';
import { Overview } from './pages/Overview.jsx';
import { Report } from './pages/Report.jsx';
import { Stats } from './pages/Stats.jsx';
import './Portal.css';

const PAGES = {
    '/portal': Overview,
    '/portal/stats': Stats,
    '/portal/events': Events,
    '/portal/melden': Report,
    '/portal/account': Account,
    '/portal/leiders': Leaders
};

export function PortalPage({ path }) {
    const portal = usePortal();

    if (portal.phase === 'loading') return <div className="portal-center"><Empty>Laden…</Empty></div>;
    if (portal.phase === 'signed-out') return <SignIn error={portal.error} />;
    if (portal.phase === 'maintenance') return <Maintenance reason={portal.error} onLogout={portal.logout} />;
    if (portal.phase === 'unlinked') return <LinkStep me={portal.me} onChange={portal.reload} onLogout={portal.logout} />;

    const Page = (path === '/portal/leiders' && !portal.me.leader) ? Overview : PAGES[path] ?? Overview;
    return (
        <PortalShell me={portal.me} path={PAGES[path] === Page ? path : '/portal'}>
            <Page me={portal.me} onChange={portal.reload} onLogout={portal.logout} />
        </PortalShell>
    );
}
