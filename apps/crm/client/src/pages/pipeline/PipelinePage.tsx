import AriaAnnouncement from '@Components/AriaAnnouncement';
import OutletPortalTransition from '@Components/react-transition-group/OutletPortalTransition';
import { ScrumboardPipeline } from '@Features/scrumboard';
import { useReduxSelector } from '@Redux/hooks';
import { selectorAriaEventsPipeline } from '@Redux/reducers/uiSlice';

function PipelinePage(): React.JSX.Element {
  const uiEvents = useReduxSelector(selectorAriaEventsPipeline);
  const nextUiEvent = uiEvents[0];

  return (
    <>
      <ScrumboardPipeline />
      <AriaAnnouncement scope="pipeline" uiEvent={nextUiEvent} />
      <OutletPortalTransition />
    </>
  );
}

export default PipelinePage;
