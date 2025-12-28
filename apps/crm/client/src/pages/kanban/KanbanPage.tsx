import OutletPortalTransition from '@Components/react-transition-group/OutletPortalTransition';
import ScrumboardKanban from '@Features/scrumboard/ScrumboardKanban';

function KanbanPage(): React.JSX.Element {
  return (
    <>
      <ScrumboardKanban />
      <OutletPortalTransition />
    </>
  );
}

export default KanbanPage;
