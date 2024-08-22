import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import { ScrumboardKanban } from '#Features/scrumboard';

function KanbanPage(): JSX.Element {
  return (
    <>
      <ScrumboardKanban />
      <OutletPortalTransition />
    </>
  );
}

export default KanbanPage;
