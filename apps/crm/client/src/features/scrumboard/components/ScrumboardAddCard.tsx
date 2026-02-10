import { Link } from 'react-router-dom';

import styles from './ScrumboardAddCard.module.scss';

type Props = {
  stageId: string;
};

function ScrumboardAddCard({ stageId }: Props): React.JSX.Element {
  return (
    <Link to={`deal/create/${stageId}`} className={styles.addCard}>
      <span>Add New Card</span>
    </Link>
  );
}

export default ScrumboardAddCard;
