import './TextField.css';

export function TextField({ label, ...props }) {
    return (
        <label className="text-field">
            <span>{label}</span>
            <input type="text" {...props} />
        </label>
    );
}
