import { Link } from '@tanstack/react-router';
import { memo } from 'react';

import styles from './ScrumboardAddStage.module.scss';

function ScrumboardAddStage(): React.JSX.Element {
  return (
    <Link to="stage/create" className={styles.addStage}>
      <span>Add Stage</span>
    </Link>
  );
}

export default memo(ScrumboardAddStage);
