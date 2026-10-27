import { StorySection } from '../story/StorySection.jsx';
import { WrappedSection } from '../wrapped/WrappedSection.jsx';
import { HallOfFame } from './HallOfFame.jsx';
import { SeasonNumbers } from './SeasonNumbers.jsx';

export function SeasonEndContent({ wrapped, onOpen }) {
    const { players, story, timeline } = wrapped;
    return (
        <>
            <SeasonNumbers players={players} />
            <WrappedSection players={players} onOpen={onOpen} />
            <HallOfFame players={players} onOpen={onOpen} />
            {story && <StorySection story={story} timeline={timeline ?? []} ended />}
        </>
    );
}
