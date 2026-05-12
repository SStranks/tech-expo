import type { Route as KanbanCreateStage } from '@Routes/kanban/stage/create';
import type { Route as PipelineCreateStage } from '@Routes/pipeline/stage/create';

import { Link } from '@tanstack/react-router';
import { memo } from 'react';

import styles from './ScrumboardAddStage.module.scss';

type Props = {
  to: typeof PipelineCreateStage.fullPath | typeof KanbanCreateStage.fullPath;
};

function ScrumboardAddStage({ to }: Props): React.JSX.Element {
  return (
    <Link to={to} className={styles.addStage}>
      <span>Add Stage</span>
    </Link>
  );
}

export default memo(ScrumboardAddStage);
