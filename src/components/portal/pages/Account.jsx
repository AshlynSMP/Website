import { useState } from 'react';
import { Button, Card, Facts, PlayerHead } from '../../ui';
import { config } from '../../../config.js';
import { formatDate } from '../../../lib/format.js';
import { unlink } from '../../../lib/portal.js';
import { PageTitle } from '../shared.jsx';

export function Account({ me, onChange, onLogout }) {
    const { player } = me;
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState(null);

    async function remove() {
        setError(null);
        try {
            await unlink();
            await onChange();
        } catch {
            setError('Ontkoppelen is mislukt.');
        }
    }

    return (
        <>
            <PageTitle>Account</PageTitle>
            <div className="portal-grid">
                <Card title="Minecraft">
                    <div className="portal-account">
                        <PlayerHead uuid={player.uuid} name={player.name} size={56} />
                        <div>
                            <strong>{player.name}</strong>
                            <p className="small muted">{player.realName}</p>
                        </div>
                    </div>
                    <Facts items={[
                        ['Gekoppeld', 'Ja'],
                        ['Speelt sinds', player.firstPlayed ? formatDate(player.firstPlayed, { day: 'numeric', month: 'long', year: 'numeric' }) : '–']
                    ]} />
                </Card>
                <Card title="Watchdog">
                    <div className="portal-account">
                        <div>
                            <strong>{me.watchdog.name}</strong>
                            <p className="small muted">Hiermee log je in op het portaal.</p>
                        </div>
                    </div>
                    <p><a href={`${config.watchdog.url}/Account/Manage`}>Beheer je Watchdog-account</a></p>
                </Card>
            </div>
            <Card title="Koppeling en sessie">
                {error && <p className="portal-error" role="alert">{error}</p>}
                {confirming && <p className="muted">Weet je het zeker? Je ziet je stats pas weer als je opnieuw koppelt.</p>}
                <div className="portal-actions">
                    {confirming ? (
                        <>
                            <Button onClick={remove}>Ja, ontkoppel</Button>
                            <Button variant="ghost" onClick={() => setConfirming(false)}>Annuleer</Button>
                        </>
                    ) : (
                        <Button variant="ghost" onClick={() => setConfirming(true)}>Ontkoppelen</Button>
                    )}
                    <Button variant="ghost" onClick={onLogout}>Uitloggen</Button>
                </div>
            </Card>
        </>
    );
}
