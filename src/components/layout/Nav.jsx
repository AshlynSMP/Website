import packImg from '../../assets/img/pack.png';
import { SectionLinks } from './SectionLinks.jsx';
import './Nav.css';

export function Nav() {
    return (
        <header className="nav">
            <a className="nav-brand" href="#top">
                <img src={packImg} alt="" />
                <span>Ashlyn SMP</span>
            </a>
            <SectionLinks className="nav-links" />
        </header>
    );
}
