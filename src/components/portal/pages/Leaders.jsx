import { useState } from 'react';
import { Button, Card, Chip, Empty, PlayerHead, TextField } from '../../ui';
import { config } from '../../../config.js';
import { usePortalResource } from '../../../hooks/usePortalResource.js';
import { parseDate, relative } from '../../../lib/format.js';
import { changeSettings, fetchAdmin, handleRequest, planEvent } from '../../../lib/portal.js';
import { PageTitle } from '../shared.jsx';

const REQUEST_ERRORS = { 'unknown-account': 'Dat Minecraft-account bestaat niet.', 'not-found': 'Die aanvraag is al behandeld.' };
const EVENT_ERRORS = { 'in-the-past': 'Die tijd is al geweest.', 'bad-request': 'Vul een naam, datum en tijd in.' };

export function Leaders({ onChange }) {
    const admin = usePortalResource(fetchAdmin, 30000);
    const refresh = async () => {
        await Promise.all([admin.reload(), onChange()]);
    };

    if (!admin.data) {
        return (
            <>
                <PageTitle>Leiders</PageTitle>
                <Card><Empty>{admin.error ? 'Laden is mislukt. Probeer het later opnieuw.' : 'Laden…'}</Empty></Card>
            </>
        );
    }

    return (
        <>
            <PageTitle>Leiders</PageTitle>
            <div className="portal-grid">
                <Requests requests={admin.data.requests} onChange={refresh} />
                <PlanEvent onChange={refresh} />
                <Settings data={admin.data} onChange={refresh} />
                <Linked linked={admin.data.linked} unlinked={admin.data.unlinked} />
            </div>
        </>
    );
}

function Requests({ requests, onChange }) {
    const [busy, setBusy] = useState(null);
    const [error, setError] = useState(null);

    async function handle(name, action) {
        setBusy(name);
        setError(null);
        try {
            await handleRequest(name, action);
            await onChange();
        } catch (e) {
            setError(REQUEST_ERRORS[e.message] ?? 'Dat lukte niet. Probeer het opnieuw.');
        } finally {
            setBusy(null);
        }
    }

    return (
        <Card title="Aanvragen" aside={requests.length > 0 && <Chip className="is-waiting">{requests.length} open</Chip>}>
            {error && <p className="portal-error" role="alert">{error}</p>}
            {requests.length === 0 ? <Empty>Geen open aanvragen.</Empty> : (
                <ul className="portal-list portal-requests">
                    {requests.map((r) => (
                        <li key={r.name}>
                            <PlayerHead name={r.name} size={28} />
                            <div>
                                <div>{r.name}</div>
                                <div className="small muted">{[r.realName, relative(r.time)].filter(Boolean).join(' · ')}</div>
                            </div>
                            <div className="portal-request-actions">
                                <Button className="small-btn" disabled={busy === r.name} onClick={() => handle(r.name, 'accept')}>Accepteer</Button>
                                <Button className="small-btn" variant="ghost" disabled={busy === r.name} onClick={() => handle(r.name, 'deny')}>Weiger</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

function PlanEvent({ onChange }) {
    const [form, setForm] = useState({ name: '', date: '', time: '20:00' });
    const [state, setState] = useState({ busy: false, error: null, done: null });
    const field = (key) => ({ value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });

    async function submit(e) {
        e.preventDefault();
        const [year, month, day] = form.date.split('-');
        const time = parseDate(`${day}-${month}-${year} ${form.time}`, config.timezone);
        if (!form.name.trim() || Number.isNaN(time)) {
            setState({ busy: false, error: EVENT_ERRORS['bad-request'], done: null });
            return;
        }
        setState({ busy: true, error: null, done: null });
        try {
            await planEvent(form.name.trim(), time);
            setState({ busy: false, error: null, done: form.name.trim() });
            setForm({ name: '', date: '', time: '20:00' });
            await onChange();
        } catch (err) {
            setState({ busy: false, error: EVENT_ERRORS[err.message] ?? 'Plannen is mislukt.', done: null });
        }
    }

    return (
        <Card title="Event plannen">
            <form className="portal-form" onSubmit={submit} noValidate>
                <TextField label="Naam" maxLength={60} {...field('name')} />
                <div className="portal-form-row">
                    <TextField label="Datum" type="date" {...field('date')} />
                    <TextField label="Tijd" type="time" {...field('time')} />
                </div>
                {state.error && <p className="portal-error" role="alert">{state.error}</p>}
                {state.done && <p className="small muted" role="status">{state.done} staat gepland.</p>}
                <div><Button type="submit" disabled={state.busy}>Plannen</Button></div>
            </form>
        </Card>
    );
}

function Settings({ data, onChange }) {
    const [reason, setReason] = useState(data.maintenance.reason ?? '');
    const [busy, setBusy] = useState(false);

    async function change(settings) {
        setBusy(true);
        try {
            await changeSettings(settings);
            await onChange();
        } finally {
            setBusy(false);
        }
    }

    const maintenance = data.maintenance.enabled;

    return (
        <Card title="Server">
            <div className="portal-settings">
                <div className="portal-setting">
                    <div>
                        <div>Onderhoud</div>
                        <div className="small muted">{maintenance ? 'Alleen leiders kunnen joinen.' : 'Iedereen kan joinen.'}</div>
                    </div>
                    <Button variant={maintenance ? undefined : 'ghost'} aria-pressed={maintenance} disabled={busy} onClick={() => change({ maintenance: !maintenance, reason })}>
                        {maintenance ? 'Aan' : 'Uit'}
                    </Button>
                </div>
                {!maintenance && <TextField label="Reden (optioneel)" maxLength={120} value={reason} onChange={(e) => setReason(e.target.value)} />}
                <div className="portal-setting">
                    <div>
                        <div>Whitelist-formulier</div>
                        <div className="small muted">Op de website, voor het seizoen begint.</div>
                    </div>
                    <Button variant={data.whitelistOpen ? undefined : 'ghost'} aria-pressed={data.whitelistOpen} disabled={busy} onClick={() => change({ whitelistOpen: !data.whitelistOpen })}>
                        {data.whitelistOpen ? 'Open' : 'Dicht'}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function Linked({ linked, unlinked }) {
    const total = linked.length + unlinked.length;

    return (
        <Card title="Gekoppeld" aside={<Chip>{linked.length} van {total}</Chip>}>
            <ul className="portal-list">
                {linked.map((l) => <li key={l.name}><span>{l.name}</span><span className="muted small">watchdog: {l.watchdog}</span></li>)}
                {unlinked.map((name) => <li key={name}><span>{name}</span><span className="muted small">nog niet gekoppeld</span></li>)}
            </ul>
            {total === 0 && <Empty>Nog niemand gespeeld.</Empty>}
        </Card>
    );
}
