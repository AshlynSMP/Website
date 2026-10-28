import { useEffect, useState } from 'react';
import { Button, Card, SelectField, TextField } from '../ui';
import { config } from '../../config.js';
import { useModpack } from '../../hooks/useModpack.js';
import { useReport } from '../../hooks/useReport.js';
import { DIMENSIONS, LEVELS, REPEATS, SYSTEMS } from '../../lib/report.js';
import { NAME_PATTERN } from '../../lib/whitelist.js';

const STORAGE_KEY = 'playtest-reporter';
const REQUIRED = ['name', 'what', 'actual'];
const FALLBACK_ERROR = 'Versturen lukt nu niet. Probeer het later opnieuw of mail naar ';

const now = () => {
    const date = new Date();
    return new Date(date - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

function remembered() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    } catch {
        return {};
    }
}

function remember({ name, system }) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, system }));
    } catch {}
}

const blank = () => ({
    name: '',
    system: SYSTEMS[0],
    ...remembered(),
    level: 'Ernstig',
    what: '',
    x: '',
    y: '',
    z: '',
    dimension: DIMENSIONS[0],
    when: now(),
    modpack: '',
    steps: '',
    expected: '',
    actual: '',
    repeat: REPEATS[0],
    attachment: '',
    honey: ''
});

export function ReportForm() {
    const modpack = useModpack(config.modpack);
    const { status, error, submit, reset } = useReport();
    const [report, setReport] = useState(blank);
    const [invalid, setInvalid] = useState(null);

    useEffect(() => {
        if (modpack) setReport((r) => (r.modpack ? r : { ...r, modpack: modpack.version }));
    }, [modpack]);

    const field = (key) => ({
        value: report[key],
        onChange: (e) => setReport((r) => ({ ...r, [key]: e.target.value }))
    });

    function onSubmit(e) {
        e.preventDefault();
        const trimmed = Object.fromEntries(Object.entries(report).map(([k, v]) => [k, v.trim()]));
        if (!NAME_PATTERN.test(trimmed.name)) {
            setInvalid('Dat is geen geldige Minecraft-naam.');
            return;
        }
        if (REQUIRED.some((key) => !trimmed[key])) {
            setInvalid('Vul in wat er mis is en wat er gebeurde.');
            return;
        }
        setInvalid(null);
        remember(trimmed);
        submit(trimmed);
    }

    function again() {
        setReport({ ...blank(), modpack: report.modpack });
        reset();
    }

    if (status === 'done') {
        return (
            <Card className="report-done" title="Melding verstuurd" role="status">
                <p className="muted">Bedankt. De crew kijkt ernaar.</p>
                <Button onClick={again}>Nog een melding</Button>
            </Card>
        );
    }

    const message = invalid ?? (error && (
        <>{FALLBACK_ERROR}<a href={`mailto:${config.crewEmail}`}>{config.crewEmail}</a>.</>
    ));

    return (
        <form className="report" onSubmit={onSubmit} noValidate>
            <Card title="Wie en hoe erg">
                <div className="report-grid">
                    <TextField label="Minecraft-naam" maxLength={16} autoComplete="off" spellCheck={false} required {...field('name')} />
                    <SelectField label="Niveau" options={Object.keys(LEVELS)} {...field('level')} />
                    <p className="report-hint">{LEVELS[report.level]}</p>
                    <TextField label="Wat is er mis?" maxLength={120} required className="wide" {...field('what')} />
                </div>
            </Card>

            <Card title="Waar en wanneer">
                <div className="report-grid">
                    <div className="report-coords">
                        <TextField label="X" inputMode="numeric" {...field('x')} />
                        <TextField label="Y" inputMode="numeric" {...field('y')} />
                        <TextField label="Z" inputMode="numeric" {...field('z')} />
                    </div>
                    <SelectField label="Dimensie" options={DIMENSIONS} {...field('dimension')} />
                    <TextField label="Wanneer" type="datetime-local" {...field('when')} />
                    <TextField label="Modpack-versie" spellCheck={false} {...field('modpack')} />
                    <SelectField label="Systeem" options={SYSTEMS} {...field('system')} />
                </div>
            </Card>

            <Card title="Wat er gebeurde">
                <div className="report-grid">
                    <TextField label="Stappen om het na te doen" multiline placeholder={'1.\n2.\n3.'} {...field('steps')} />
                    <TextField label="Wat je verwachtte" multiline {...field('expected')} />
                    <TextField label="Wat er gebeurde" multiline required {...field('actual')} />
                    <SelectField label="Gebeurt het elke keer?" options={REPEATS} {...field('repeat')} />
                    <TextField label="Link naar screenshot, clip of crashlog" type="url" placeholder="https://" {...field('attachment')} />
                </div>
            </Card>

            <input className="report-honey" tabIndex={-1} autoComplete="off" aria-hidden="true" {...field('honey')} />

            <div className="report-actions">
                <Button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Versturen...' : 'Melding versturen'}
                </Button>
                {message && <p className="report-error" role="alert">{message}</p>}
            </div>
        </form>
    );
}
