import './PlayerTags.css';

export function PlayerTags({ op }) {
    return (
        <span className="tags">
            {op && <span className="tag op">Crew</span>}
        </span>
    );
}
