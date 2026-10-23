import './Tabs.css';

export function Tabs({ options, value, onChange, label }) {
    return (
        <div className="tabs" role="tablist" aria-label={label}>
            {options.map(([key, text]) => (
                <button key={key} type="button" role="tab" aria-selected={key === value} onClick={() => onChange(key)}>
                    {text}
                </button>
            ))}
        </div>
    );
}
