import { Dialog } from '../ui';

const STEPS = (modpackUrl) => [
    {
        title: 'Download de Modrinth app',
        text: <>Gratis, voor Windows, macOS en Linux. <a href="https://modrinth.com/app" target="_blank" rel="noopener">modrinth.com/app</a></>
    },
    {
        title: 'Log in met je Microsoft-account',
        text: 'Doe dit in de app zelf. Het is hetzelfde account waarmee je Minecraft hebt gekocht.'
    },
    {
        title: 'Installeer de modpack',
        text: <>Open de <a href={modpackUrl} target="_blank" rel="noopener">Ashlyn SMP modpack</a> en klik op <em>Install</em>. Kies daarna de Modrinth app.</>
    },
    {
        title: 'Start Minecraft vanuit de Modrinth app',
        text: <>Klik bij Ashlyn SMP op <em>Play</em>. De eerste keer duurt het even, de app downloadt dan alle mods.</>
    },
    {
        title: 'Join de server',
        text: 'Multiplayer → Ashlyn SMP.'
    },
    {
        title: 'Stel je microfoon in',
        text: <>Druk in-game op <kbd>V</kbd> voor de voice chat instellingen.</>
    }
];

export function InstallGuide({ open, onClose, modpackUrl }) {
    return (
        <Dialog open={open} onClose={onClose} className="guide" aria-labelledby="guide-title">
            <h3 id="guide-title">Installatiegids</h3>
            <ol className="guide-steps">
                {STEPS(modpackUrl).map((step) => (
                    <li key={step.title}>
                        <strong>{step.title}</strong>
                        <span>{step.text}</span>
                    </li>
                ))}
            </ol>
            <p className="muted small guide-note">
                Komt er een nieuwe versie van de modpack? Dan zie je dat in de Modrinth app. Klik op updaten voordat je weer speelt.
            </p>
        </Dialog>
    );
}
