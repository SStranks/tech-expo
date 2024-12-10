import OutletPortalTransition from '@Components/react-transition-group/OutletPortalTransition';
import { ScrumboardPipeline } from '@Features/scrumboard';

function PipelinePage(): React.JSX.Element {
  return (
    <>
      <ScrumboardPipeline />
      <OutletPortalTransition />
    </>
  );
}

export default PipelinePage;
