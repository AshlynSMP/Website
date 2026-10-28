import packImg from '../../assets/img/pack.png';
import { SectionLinks } from './SectionLinks.jsx';
import './Nav.css';

export function Nav({ links = true }) {
    return (
        <header className="nav">
            <a className="nav-brand" href={links ? '#top' : './'}>
                <img src={packImg} alt="" />
                <span>Ashlyn SMP</span>
            </a>
            {links && <SectionLinks className="nav-links" />}
        </header>
    );
}
