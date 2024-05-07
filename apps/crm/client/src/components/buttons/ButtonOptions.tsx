import { IconMenuDots } from '#Components/svg';
import styles from './_Buttons.module.scss';

interface IProps {
  onClick?: (data?: unknown) => void;
}

function ButtonOptions(props: IProps): JSX.Element {
  const { onClick } = props;

  return (
    <button type="button" onClick={onClick} className={styles.optionsBtn}>
      <IconMenuDots svgClass={styles.optionsBtn__svg} />
    </button>
  );
}

export default ButtonOptions;
