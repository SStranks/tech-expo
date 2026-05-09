import type { UUID } from '@apps/crm-shared';

import { Link } from '@tanstack/react-router';

import styles from './ScrumboardAddCard.module.scss';

type Props = {
  stageId: UUID;
};

function ScrumboardAddCard({ stageId }: Props): React.JSX.Element {
  return (
    <Link to={`deal/create/${stageId}`} className={styles.addCard}>
      <span>Add New Card</span>
    </Link>
  );
}

export default ScrumboardAddCard;
