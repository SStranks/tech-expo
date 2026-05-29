import type { UUID } from '@apps/crm-shared';

import type { Route as KanbanCreateRoute } from '@Routes/kanban/task/create.$stageId';
import type { Route as PipelineCreateRoute } from '@Routes/pipeline/deal/create.$stageId';

import { Link } from '@tanstack/react-router';

import IconOperatorPlus from '@Components/svg/IconOperatorPlus';

import styles from './ScrumboardColumnAddBtn.module.scss';

type Props = {
  stageId: UUID;
  to: typeof PipelineCreateRoute.fullPath | typeof KanbanCreateRoute.fullPath;
  columnStyle?: 'won' | 'lost';
};

function ScrumboardColumnAddBtn({ columnStyle, stageId, to }: Props): React.JSX.Element {
  return (
    <Link
      to={to}
      params={{ stageId }}
      className={`${styles.addCardBtn} ${columnStyle ? styles[`addCardBtn--${columnStyle}`] : ''}`}>
      <IconOperatorPlus svgClass={styles.addCardBtn__svg} />
    </Link>
  );
}

export default ScrumboardColumnAddBtn;
