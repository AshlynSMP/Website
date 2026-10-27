import { Facts, PlayerHead } from '../ui';
import { dimensionLabel } from '../../lib/game.js';

function HourChart({ hours }) {
    const max = Math.max(1, ...hours);
    return (
        <div className="wrapped-hours" aria-hidden="true">
            {hours.map((minutes, hour) => (
                <span key={hour} style={{ height: `${Math.max(4, (minutes / max) * 100)}%` }} />
            ))}
        </div>
    );
}

function DimensionBars({ dimensions }) {
    return (
        <div className="wrapped-dimensions">
            {dimensions.map(([key, share]) => (
                <div key={key} className={`wrapped-dimension dim-${key}`}>
                    <span>{dimensionLabel(key)}</span>
                    <div className="bar"><i style={{ width: `${share * 100}%` }} /></div>
                    <span className="share">{Math.round(share * 100)}%</span>
                </div>
            ))}
        </div>
    );
}

export function WrappedSlide({ slide, accent, children }) {
    return (
        <div className={`wrapped-slide accent-${accent}`}>
            {slide.head && <PlayerHead name={slide.value} size={128} />}
            <span className="wrapped-label">{slide.label}</span>
            <span className={slide.small ? 'wrapped-value small' : 'wrapped-value'}>{slide.value}</span>
            {slide.sub && <span className="wrapped-sub">{slide.sub}</span>}
            {slide.hours && <HourChart hours={slide.hours} />}
            {slide.dimensions && <DimensionBars dimensions={slide.dimensions} />}
            {slide.facts && <Facts items={slide.facts} className="wrapped-facts" />}
            {children}
        </div>
    );
}
