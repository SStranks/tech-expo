import { Link } from 'react-router-dom';

import styles from './ScrumboardAddStage.module.scss';

function ScrumboardAddStage(): JSX.Element {
  return (
    <Link to={'stage/create'} className={styles.addStage}>
      <span>Add Stage</span>
    </Link>
  );
}

export default ScrumboardAddStage;
