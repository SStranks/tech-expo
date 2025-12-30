import { memo } from 'react';

import { useReduxSelector } from '@Redux/hooks';

import ScrumboardAddStage from './components/ScrumboardAddStage';
import { selectorStagesByNotPermanent, selectorStagesByPermanent } from './redux/kanbanSlice';
import ScrumboardKanbanStage from './ScrumboardKanbanStage';
import ScrumboardKanbanStageUnassigned from './ScrumboardKanbanStageUnassigned';

import styles from './ScrumboardColumns.module.scss';

function ScrumboardKanbanColumns(): React.JSX.Element {
  const userCreatedStages = useReduxSelector(selectorStagesByNotPermanent);
  const permanentStages = useReduxSelector(selectorStagesByPermanent);

  return (
    <div className={styles.columns}>
      <ScrumboardKanbanStageUnassigned stageId={permanentStages['unassigned'].id} />
      {userCreatedStages.map((stage) => {
        return <ScrumboardKanbanStage key={stage.id} stageId={stage.id} />;
      })}
      <ScrumboardAddStage />
    </div>
  );
}

export default memo(ScrumboardKanbanColumns);
