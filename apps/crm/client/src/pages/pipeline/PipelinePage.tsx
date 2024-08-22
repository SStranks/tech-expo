import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import { ScrumboardPipeline } from '#Features/scrumboard';

function PipelinePage(): JSX.Element {
  return (
    <>
      <ScrumboardPipeline />
      <OutletPortalTransition />
    </>
  );
}

export default PipelinePage;
