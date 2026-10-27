import { cx } from '../../lib/cx.js';
import { roman } from '../../lib/format.js';

function Act({ number, title, info, state }) {
    return (
        <li className={cx('story-act', state)}>
            <span className="story-act-num">Act {roman(number)}</span>
            <span className="story-act-name">{title ?? '???'}</span>
            {info && <p className="story-act-info">{info}</p>}
        </li>
    );
}

export function ActList({ story, ended = false }) {
    const { act, acts, total = 3 } = story;
    const upcoming = ended ? [] : Array.from({ length: Math.max(0, total - act) }, (_, i) => act + 1 + i);
    return (
        <ol className="acts">
            {acts.map((a) => (
                <Act key={a.number} {...a} state={ended ? null : a.number === act ? 'current' : 'done'} />
            ))}
            {upcoming.map((number) => <Act key={number} number={number} state="locked" />)}
        </ol>
    );
}
