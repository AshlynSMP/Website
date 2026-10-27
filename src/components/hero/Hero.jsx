import titleImg from '../../assets/img/title.png';
import { cx } from '../../lib/cx.js';
import { HeroStats } from './HeroStats.jsx';
import { MaintenanceNotice } from './MaintenanceNotice.jsx';
import { MistCanvas } from './MistCanvas.jsx';
import { OfflineNotice } from './OfflineNotice.jsx';
import { Preseason } from './Preseason.jsx';
import { ScrollCue } from './ScrollCue.jsx';
import { SeasonEnded } from './SeasonEnded.jsx';
import { WhitelistForm } from './WhitelistForm.jsx';
import './Hero.css';

export function Hero({ phase, seasonStart, seasonEnd, connection, maintenance, status, wrappedPlayers, cue }) {
    const live = phase === 'live';
    const offline = live && connection === 'offline';

    return (
        <section className={cx('hero', !live && 'is-preseason', (phase === 'preseason' || offline) && 'is-glitch')}>
            <MistCanvas />
            <div className="hero-inner">
                <div className="hero-title" style={{ '--title': `url(${titleImg})` }}>
                    <img src={titleImg} alt="Ashlyn SMP Seizoen II: Mistwalkers" width="4053" height="1104" />
                </div>
                {phase === 'preseason' && (
                    <>
                        <Preseason start={seasonStart} />
                        <WhitelistForm />
                    </>
                )}
                {phase === 'ended' && <SeasonEnded start={seasonStart} end={seasonEnd} players={wrappedPlayers} />}
                {offline && <OfflineNotice />}
                {live && maintenance && <MaintenanceNotice reason={maintenance.reason} />}
                {live && !offline && !maintenance && (
                    <>
                        <p className="hero-lead">
                            Je wordt wakker in een bos. Je weet niet waar je bent, of hoe je hier kwam.
                            En welke kant je ook op loopt, je komt altijd weer terug.
                        </p>
                        {status && <HeroStats status={status} />}
                    </>
                )}
            </div>
            {cue && <ScrollCue target={cue.target}>{cue.label}</ScrollCue>}
        </section>
    );
}
