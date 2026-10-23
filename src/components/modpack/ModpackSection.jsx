import { useState } from 'react';
import packImg from '../../assets/img/pack.png';
import { Button, Card, Facts, Section } from '../ui';
import { config } from '../../config.js';
import { useModpack } from '../../hooks/useModpack.js';
import { formatDate } from '../../lib/format.js';
import { InstallGuide } from './InstallGuide.jsx';
import './Modpack.css';

export function ModpackSection() {
    const modpack = useModpack(config.modpack);
    const [guideOpen, setGuideOpen] = useState(false);
    const url = modpack?.url ?? `https://modrinth.com/modpack/${config.modpack}`;

    return (
        <Section id="modpack" title="Modpack">
            <Card className="join-card">
                <img className="join-icon" src={packImg} alt="" width="139" height="104" />
                <div className="join-body">
                    <h3>Ashlyn SMP modpack</h3>
                    <p className="muted">
                        Alles wat je nodig hebt om mee te doen, in één keer. Installeer hem in de Modrinth app en start Minecraft vanuit daar.
                    </p>
                    {modpack && (
                        <Facts
                            className="join-facts"
                            items={[
                                ['Versie', modpack.version],
                                ['Bijgewerkt', formatDate(modpack.updated, { day: 'numeric', month: 'long', year: 'numeric' })]
                            ]}
                        />
                    )}
                    <div className="join-actions">
                        <Button href={url}>Bekijk op Modrinth</Button>
                        <Button variant="ghost" onClick={() => setGuideOpen(true)}>Installatiegids</Button>
                    </div>
                </div>
            </Card>
            <InstallGuide open={guideOpen} onClose={() => setGuideOpen(false)} modpackUrl={url} />
        </Section>
    );
}
