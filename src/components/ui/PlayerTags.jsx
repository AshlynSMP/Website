import './PlayerTags.css';

export function PlayerTags({ leader, op }) {
    return (
        <span className="tags">
            {leader && <span className="tag leader">Leider</span>}
            {op && <span className="tag op">Crew</span>}
        </span>
    );
}
