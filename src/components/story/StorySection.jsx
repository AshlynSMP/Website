import { Section, Subhead } from '../ui';
import { ActList } from './ActList.jsx';
import { Timeline } from './Timeline.jsx';
import './Story.css';

export function StorySection({ story, timeline, liveMs }) {
    return (
        <Section
            id="verhaal"
            title="Het verhaal"
            intro="Niemand weet hoe lang de mist er al hangt. Wie hier wakker wordt, herinnert zich weinig. Alleen dat er iets niet klopt aan deze wereld."
        >
            {story && <ActList story={story} />}
            <Subhead>Gebeurtenissen</Subhead>
            <Timeline events={timeline} liveMs={liveMs} />
        </Section>
    );
}
