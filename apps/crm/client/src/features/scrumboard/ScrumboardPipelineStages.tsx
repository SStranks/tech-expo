import { useReduxSelector } from '@Redux/hooks';

import {
  ScrumboardAddStage,
  ScrumboardPipelineStage,
  ScrumboardPipelineStageLost,
  ScrumboardPipelineStageUnassigned,
  ScrumboardPipelineStageWon,
} from './index';
import { selectorStagesByNotPermanent, selectorStagesByPermanent } from './redux/pipelineSlice';

import styles from './ScrumboardColumns.module.scss';

function ScrumboardPipelineStages(): React.JSX.Element {
  const userCreatedStages = useReduxSelector(selectorStagesByNotPermanent);
  const permanentStages = useReduxSelector(selectorStagesByPermanent);

  return (
    <div className={styles.columns}>
      <ScrumboardPipelineStageUnassigned stageId={permanentStages['unassigned'].id} />
      {userCreatedStages.map((column) => {
        return <ScrumboardPipelineStage key={column.id} stageId={column.id} />;
      })}
      <ScrumboardAddStage />
      <ScrumboardPipelineStageWon stageId={permanentStages['won'].id} />
      <ScrumboardPipelineStageLost stageId={permanentStages['lost'].id} />
    </div>
  );
}

export default ScrumboardPipelineStages;
