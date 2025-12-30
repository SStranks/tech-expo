import { Link } from 'react-router-dom';

import IconOperatorPlus from '@Components/svg/IconOperatorPlus';

import styles from './ScrumboardColumnAddBtn.module.scss';

interface IProps {
  columnStyle?: 'won' | 'lost';
  stageId: string;
}

function ScrumboardColumnAddBtn({ columnStyle, stageId }: IProps): React.JSX.Element {
  return (
    <Link
      to="deal/create"
      state={{ stageId }}
      className={`${styles.addCardBtn} ${columnStyle ? styles[`addCardBtn--${columnStyle}`] : ''}`}>
      <IconOperatorPlus svgClass={styles.addCardBtn__svg} />
    </Link>
  );
}

export default ScrumboardColumnAddBtn;
