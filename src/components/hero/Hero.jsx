import titleImg from '../../assets/img/title.png';
import { cx } from '../../lib/cx.js';
import { HeroStats } from './HeroStats.jsx';
import { MistCanvas } from './MistCanvas.jsx';
import { OfflineNotice } from './OfflineNotice.jsx';
import { Preseason } from './Preseason.jsx';
import { ScrollCue } from './ScrollCue.jsx';
import { WhitelistForm } from './WhitelistForm.jsx';
import './Hero.css';

export function Hero({ preseason, seasonStart, connection, status, cue }) {
    return (
        <section className={cx('hero', preseason && 'is-preseason', (preseason || connection === 'offline') && 'is-glitch')}>
            <MistCanvas />
            <div className="hero-inner">
                <div className="hero-title" style={{ '--title': `url(${titleImg})` }}>
                    <img src={titleImg} alt="Ashlyn SMP Seizoen II: Mistwalkers" width="4053" height="1104" />
                </div>
                {preseason && <Preseason start={seasonStart} />}
                {preseason && <WhitelistForm />}
                {!preseason && connection === 'offline' && <OfflineNotice />}
                {!preseason && connection !== 'offline' && (
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
