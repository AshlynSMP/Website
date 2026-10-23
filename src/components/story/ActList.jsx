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

export function ActList({ story }) {
    const { act, acts, total = 3 } = story;
    return (
        <ol className="acts">
            {acts.map((a) => (
                <Act key={a.number} {...a} state={a.number === act ? 'current' : 'done'} />
            ))}
            {act < total && <Act number={act + 1} state="locked" />}
        </ol>
    );
}
