import { GlitchText } from '../ui';

export function OfflineNotice() {
    return (
        <div className="hero-offline" role="status">
            <span className="offline-dot" />
            <GlitchText text="Server offline" />
        </div>
    );
}
