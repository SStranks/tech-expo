import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import ScrumBoard from '#Features/scrumboard/Scrumboard';

function KanbanPage(): JSX.Element {
  return (
    <>
      <ScrumBoard page="kanban" />
      <OutletPortalTransition />
    </>
  );
}

export default KanbanPage;
