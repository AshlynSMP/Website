import logoImg from '../../assets/img/logo.png';
import { SectionLinks } from './SectionLinks.jsx';
import './Footer.css';

export function Footer({ online }) {
    return (
        <footer className="footer">
            <img src={logoImg} alt="Ashlyn SMP" className="footer-logo" />
            {online && <SectionLinks className="footer-links" />}
            <p className="small">Ashlyn SMP is een privé server. Niet verbonden aan Mojang of Microsoft.</p>
        </footer>
    );
}
