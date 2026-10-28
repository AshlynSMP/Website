import { SeasonEndContent } from './components/ended/SeasonEndContent.jsx';
import { Hero } from './components/hero/Hero.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { Nav } from './components/layout/Nav.jsx';
import { LiveSection } from './components/live/LiveSection.jsx';
import { ModpackSection } from './components/modpack/ModpackSection.jsx';
import { PlayersSection } from './components/players/PlayersSection.jsx';
import { ProfileProvider } from './components/players/ProfileContext.jsx';
import { ReportPage } from './components/report/ReportPage.jsx';
import { StorySection } from './components/story/StorySection.jsx';
import { WrappedStory } from './components/wrapped/WrappedStory.jsx';
import { config } from './config.js';
import { useGlitchStorm } from './hooks/useGlitchStorm.js';
import { useHash } from './hooks/useHash.js';
import { useIsBefore } from './hooks/useIsBefore.js';
import { useStatus } from './hooks/useStatus.js';
import { useWrapped } from './hooks/useWrapped.js';
import { parseDate } from './lib/format.js';

const MODPACK_CUE = { target: 'modpack', label: 'Bekijk de modpack' };
const WRAPPED_CUE = { target: 'wrapped', label: 'Bekijk je Wrapped' };
const SEASON_START = config.seasonStart ? parseDate(config.seasonStart, config.timezone) : null;
const SEASON_END = config.seasonEnd ? parseDate(config.seasonEnd, config.timezone) : null;

export default function App() {
    const hash = useHash();
    if (config.playtestReport && hash === '#melden') return <ReportPage />;
    return <Site />;
}

function Site() {
    const beforeStart = useIsBefore(SEASON_START ?? 0);
    const beforeEnd = useIsBefore(SEASON_END ?? Infinity);
    const phase = SEASON_START === null || beforeStart ? 'preseason' : beforeEnd ? 'live' : 'ended';
    const live = phase === 'live';
    const { status, connection } = useStatus({ paused: !live });
    const maintenance = live && connection === 'online' && status?.maintenance?.enabled ? status.maintenance : null;
    const online = live && connection === 'online' && !maintenance;
    useGlitchStorm({ enabled: phase === 'preseason' || (live && connection === 'offline') });
    const wrapped = useWrapped({ enabled: phase === 'ended' });

    return (
        <ProfileProvider status={status}>
            {online && <Nav />}
            <main id="top">
                <Hero
                    phase={phase}
                    seasonStart={SEASON_START}
                    seasonEnd={SEASON_END}
                    connection={connection}
                    maintenance={maintenance}
                    status={status}
                    wrappedPlayers={wrapped.data?.players}
                    cue={phase === 'ended' && wrapped.data ? WRAPPED_CUE : phase === 'preseason' && config.showModpackBeforeSeason ? MODPACK_CUE : null}
                />
                {wrapped.data && <SeasonEndContent wrapped={wrapped.data} onOpen={wrapped.open} />}
                {online && (
                    <>
                        <StorySection story={status.story} timeline={status.timeline ?? []} liveMs={status.event?.liveMs} />
                        <LiveSection status={status} />
                        <PlayersSection roster={status.roster ?? []} />
                    </>
                )}
                {(live || (phase === 'preseason' && config.showModpackBeforeSeason)) && <ModpackSection />}
            </main>
            {phase !== 'preseason' && <Footer online={online} />}
            {wrapped.player && (
                <WrappedStory player={wrapped.player} players={wrapped.data.players} onClose={wrapped.close} />
            )}
        </ProfileProvider>
    );
}
