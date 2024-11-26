import { Link } from 'react-router-dom';

import styles from './ScrumboardAddCard.module.scss';

interface IProps {
  columnId: string;
}

function ScrumboardAddCard({ columnId }: IProps): JSX.Element {
  return (
    <Link to={'deal/create'} state={{ columnId }} className={styles.addCard}>
      <span>Add New Card</span>
    </Link>
  );
}

export default ScrumboardAddCard;
