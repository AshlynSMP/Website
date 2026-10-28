import { config } from '../config.js';

export const LEVELS = {
    Blokkerend: 'Je kunt niet joinen, het spel crasht, of iets maakt het seizoen kapot.',
    Ernstig: 'Een functie werkt niet, je raakt items of voortgang kwijt, of je kunt iets misbruiken.',
    Klein: 'Het werkt, maar ziet er verkeerd uit: een texture, een tikfout, een geluid.',
    Idee: 'Geen fout, maar iets wat beter, duidelijker of leuker kan.'
};
export const DIMENSIONS = ['Overworld', 'Nether', 'End', 'Niet van toepassing'];
export const SYSTEMS = ['Windows', 'macOS', 'Linux'];
export const REPEATS = ['Elke keer', 'Soms', 'Eén keer'];

const where = ({ x, y, z, dimension }) =>
    [x, y, z].some(Boolean) ? `x ${x || '?'} y ${y || '?'} z ${z || '?'} (${dimension})` : dimension;

export async function sendReport(report) {
    const res = await fetch(`https://formsubmit.co/ajax/${config.crewEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            _subject: `[${report.level}] ${report.what} (${report.name})`,
            _template: 'table',
            _honey: report.honey,
            Speler: report.name,
            Niveau: report.level,
            Wat: report.what,
            Waar: where(report),
            Wanneer: report.when.replace('T', ' '),
            Modpack: report.modpack,
            Systeem: report.system,
            Stappen: report.steps,
            Verwacht: report.expected,
            Gebeurd: report.actual,
            'Elke keer?': report.repeat,
            Bijlage: report.attachment
        })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || String(body.success) === 'false') throw new Error(body.message ?? 'unavailable');
}
