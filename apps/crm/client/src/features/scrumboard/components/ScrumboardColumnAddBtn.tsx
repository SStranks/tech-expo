import { Link } from 'react-router-dom';

import IconOperatorPlus from '@Components/svg/IconOperatorPlus';

import styles from './ScrumboardColumnAddBtn.module.scss';

type Props = {
  columnStyle?: 'won' | 'lost';
  stageId: string;
};

function ScrumboardColumnAddBtn({ columnStyle, stageId }: Props): React.JSX.Element {
  return (
    <Link
      to={`deal/create/${stageId}`}
      className={`${styles.addCardBtn} ${columnStyle ? styles[`addCardBtn--${columnStyle}`] : ''}`}>
      <IconOperatorPlus svgClass={styles.addCardBtn__svg} />
    </Link>
  );
}

export default ScrumboardColumnAddBtn;
