import { IconOperatorPlus } from '#Components/svg';
import styles from './_ScrumboardColumnAddBtn.module.scss';

interface IProps {
  columnStyle?: 'won' | 'lost';
}

function ScrumboardCardAddBtn({ columnStyle }: IProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => console.log('Fire')}
      className={`${styles.addCardBtn} ${columnStyle ? styles[`addCardBtn--${columnStyle}`] : ''}`}>
      <IconOperatorPlus svgClass={styles.addCardBtn__svg} />
    </button>
  );
}

export default ScrumboardCardAddBtn;
