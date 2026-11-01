const PATHS = {
    home: <path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" />,
    stats: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
    events: <><rect x="3" y="5" width="18" height="16" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    report: <path d="M5 21V4h11l-2 4 2 4H5" />,
    account: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
    leaders: <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />,
    copy: <><rect x="8" y="8" width="12" height="12" /><path d="M4 16V4h12" /></>,
    check: <path d="M4 12l5 5L20 6" />
};

export function Icon({ name, size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {PATHS[name]}
        </svg>
    );
}
