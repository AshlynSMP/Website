import { Section } from '../ui';
import { Footer } from '../layout/Footer.jsx';
import { Nav } from '../layout/Nav.jsx';
import { ReportForm } from './ReportForm.jsx';
import './Report.css';

export function ReportPage() {
    return (
        <>
            <Nav links={false} />
            <main id="top">
                <Section
                    id="melden"
                    title="Bug melden"
                    intro="Voor playtesters. Eén bug per melding, met stappen om het na te doen."
                >
                    <ReportForm />
                </Section>
            </main>
            <Footer />
        </>
    );
}
