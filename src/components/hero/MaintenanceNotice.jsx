export function MaintenanceNotice({ reason }) {
    return (
        <div className="hero-maintenance" role="status">
            <div className="hero-maintenance-title">
                <span className="maintenance-dot" />
                In onderhoud
            </div>
            <p>{reason || 'Je kunt even niet joinen. Probeer het later nog eens.'}</p>
        </div>
    );
}
