import { Hero } from './components/hero/Hero.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { Nav } from './components/layout/Nav.jsx';
import { LiveSection } from './components/live/LiveSection.jsx';
import { ModpackSection } from './components/modpack/ModpackSection.jsx';
import { PlayersSection } from './components/players/PlayersSection.jsx';
import { ProfileProvider } from './components/players/ProfileContext.jsx';
import { StorySection } from './components/story/StorySection.jsx';
import { config } from './config.js';
import { useGlitchStorm } from './hooks/useGlitchStorm.js';
import { useIsBefore } from './hooks/useIsBefore.js';
import { useStatus } from './hooks/useStatus.js';
import { parseDate } from './lib/format.js';

const MODPACK_CUE = { target: 'modpack', label: 'Bekijk de modpack' };
const SEASON_START = config.seasonStart ? parseDate(config.seasonStart, config.timezone) : null;

export default function App() {
    const beforeSeason = useIsBefore(SEASON_START ?? 0);
    const preseason = SEASON_START === null || beforeSeason;
    const { status, connection } = useStatus({ paused: preseason });
    const maintenance = connection === 'online' && status?.maintenance?.enabled ? status.maintenance : null;
    const online = connection === 'online' && !maintenance;
    useGlitchStorm({ enabled: preseason || connection === 'offline' });

    return (
        <ProfileProvider status={status}>
            {online && <Nav />}
            <main id="top">
                <Hero
                    preseason={preseason}
                    seasonStart={SEASON_START}
                    connection={connection}
                    maintenance={maintenance}
                    status={status}
                    cue={preseason && config.showModpackBeforeSeason ? MODPACK_CUE : null}
                />
                {!preseason && online && (
                    <>
                        <StorySection story={status.story} timeline={status.timeline ?? []} liveMs={status.event?.liveMs} />
                        <LiveSection status={status} />
                        <PlayersSection roster={status.roster ?? []} />
                    </>
                )}
                {(!preseason || config.showModpackBeforeSeason) && <ModpackSection />}
            </main>
            {!preseason && <Footer online={online} />}
        </ProfileProvider>
    );
}
