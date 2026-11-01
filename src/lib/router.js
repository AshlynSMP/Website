const OLD_HASHES = { '#melden': '/melden', '#portal': '/portal' };

export const currentPath = () => location.pathname.replace(/\/+$/, '') || '/';

export function navigate(to, { replace = false } = {}) {
    if (to === location.pathname + location.search) return;
    history[replace ? 'replaceState' : 'pushState'](null, '', to);
    dispatchEvent(new PopStateEvent('popstate'));
    scrollTo(0, 0);
}

export function upgradeOldHashes() {
    const path = OLD_HASHES[location.hash];
    if (path) history.replaceState(null, '', path);
}
