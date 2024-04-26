import { IconClose } from '#Components/svg';
import styles from './_ButtonClose.module.scss';

interface IProps {
  buttonClickFn?: (data?: unknown) => void;
}

function ButtonClose(props: IProps): JSX.Element {
  const { buttonClickFn } = props;

  return (
    <button type="button" onClick={buttonClickFn} className={styles.closeBtn}>
      <IconClose svgClass={styles.closeBtn__svg} />
    </button>
  );
}

export default ButtonClose;
