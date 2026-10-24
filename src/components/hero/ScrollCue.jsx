export function ScrollCue({ target, children }) {
    return (
        <button
            type="button"
            className="scroll-cue"
            onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
        >
            {children}
            <span className="scroll-cue-arrow" aria-hidden="true" />
        </button>
    );
}
