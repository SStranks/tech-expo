import { Link } from 'react-router-dom';

import { IconOperatorPlus } from '#Components/svg';

import styles from './_ScrumboardColumnAddBtn.module.scss';

interface IProps {
  columnStyle?: 'won' | 'lost';
  columnId: string;
}

function ScrumboardColumnAddBtn({ columnId, columnStyle }: IProps): JSX.Element {
  return (
    <Link
      to={'deal/create'}
      state={{ columnId }}
      className={`${styles.addCardBtn} ${columnStyle ? styles[`addCardBtn--${columnStyle}`] : ''}`}>
      <IconOperatorPlus svgClass={styles.addCardBtn__svg} />
    </Link>
  );
}

export default ScrumboardColumnAddBtn;
