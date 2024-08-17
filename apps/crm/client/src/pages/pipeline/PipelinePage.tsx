import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import ScrumBoard from '#Features/scrumboard/Scrumboard';

function PipelinePage(): JSX.Element {
  return (
    <>
      <ScrumBoard />
      <OutletPortalTransition />
    </>
  );
}

export default PipelinePage;
