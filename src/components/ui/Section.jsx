import './Section.css';

export function Section({ id, title, intro, children }) {
    return (
        <section className="section" id={id}>
            <div className="section-head">
                <h2>{title}</h2>
                {intro && <p className="muted">{intro}</p>}
            </div>
            {children}
        </section>
    );
}

export function Subhead({ children }) {
    return (
        <div className="subhead">
            <h3>{children}</h3>
        </div>
    );
}
