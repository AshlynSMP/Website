import { navigate } from '../../lib/router.js';

export function Link({ href, onClick, ...props }) {
    function click(e) {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
    }

    return <a href={href} onClick={click} {...props} />;
}
