import { Card } from '../ui';
import { cx } from '../../lib/cx.js';
import { signalLabel } from '../../lib/game.js';

const TOWERS = [['noord', 'Noord'], ['zuid', 'Zuid']];

function Mast() {
    return (
        <svg className="mast" viewBox="0 0 40 90" aria-hidden="true">
            <g className="lattice" fill="none" strokeWidth="2">
                <path d="M20 8 L8 88 M20 8 L32 88" />
                <path d="M17 26 L23 26 M14 46 L26 46 M11 66 L29 66 M8 86 L32 86" />
                <path d="M17 26 L26 46 M23 26 L14 46 M14 46 L29 66 M26 46 L11 66 M11 66 L32 86 M29 66 L8 86" />
            </g>
            <circle className="beacon" cx="20" cy="6" r="4" />
        </svg>
    );
}

function Tower({ name, on }) {
    return (
        <div className={cx('tower', on ? 'on' : 'off')}>
            <Mast />
            <span className="tower-name">{name}</span>
            <span className="tower-state">{on ? 'Online' : 'Offline'}</span>
        </div>
    );
}

export function TowersCard({ radio }) {
    return (
        <Card className="towers-card" title="Radio torens">
            <div className="towers">
                {TOWERS.map(([key, name]) => <Tower key={key} name={name} on={radio.towers[key]} />)}
            </div>
            <p className="signal-line">
                Signaal <strong className={`signal ${radio.signal}`}>{signalLabel(radio.signal)}</strong>
            </p>
        </Card>
    );
}
