import { cx } from '../../lib/cx.js';
import './TextField.css';

export function TextField({ label, multiline, className, ...props }) {
    return (
        <label className={cx('text-field', className)}>
            <span>{label}</span>
            {multiline ? <textarea rows={4} {...props} /> : <input type="text" {...props} />}
        </label>
    );
}

export function SelectField({ label, options, className, ...props }) {
    return (
        <label className={cx('text-field', className)}>
            <span>{label}</span>
            <select {...props}>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </label>
    );
}
