import { ReportForm } from '../../report/ReportForm.jsx';
import { PageTitle } from '../shared.jsx';
import '../../report/Report.css';

const DIMENSIONS = { overworld: 'Overworld', nether: 'Nether', end: 'End' };

export function Report({ me }) {
    const { player } = me;
    const defaults = { name: player.name };
    if (player.live) defaults.dimension = DIMENSIONS[player.live.dimension];

    return (
        <>
            <PageTitle>Bug melden</PageTitle>
            <p className="muted portal-intro">Eén bug per melding, met stappen om het na te doen.</p>
            <ReportForm defaults={defaults} />
        </>
    );
}
