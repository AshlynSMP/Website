import packImg from '../../assets/img/pack.png';
import { config } from '../../config.js';
import { PORTAL_PATH } from '../../lib/navigation.js';
import { Link } from '../ui/Link.jsx';
import { SectionLinks } from './SectionLinks.jsx';
import './Nav.css';

export function Nav({ links = true }) {
    return (
        <header className="nav">
            <a className="nav-brand" href={links ? '#top' : '/'}>
                <img src={packImg} alt="" />
                <span>Ashlyn SMP</span>
            </a>
            {links && <SectionLinks className="nav-links" />}
            {links && config.portal && <Link className="btn nav-portal" href={PORTAL_PATH}>Portaal</Link>}
        </header>
    );
}
