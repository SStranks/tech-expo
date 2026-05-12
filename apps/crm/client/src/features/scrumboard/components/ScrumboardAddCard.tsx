import type { UUID } from '@apps/crm-shared';

import type { Route as KanbanCreateRoute } from '@Routes/kanban/task/create.$stageId';
import type { Route as PipelineCreateRoute } from '@Routes/pipeline/deal/create.$stageId';

import { Link } from '@tanstack/react-router';

import styles from './ScrumboardAddCard.module.scss';

type Props = {
  to: typeof PipelineCreateRoute.fullPath | typeof KanbanCreateRoute.fullPath;
  stageId: UUID;
};

function ScrumboardAddCard({ stageId, to }: Props): React.JSX.Element {
  return (
    <Link to={to} params={{ stageId }} className={styles.addCard}>
      <span>Add New Card</span>
    </Link>
  );
}

export default ScrumboardAddCard;
