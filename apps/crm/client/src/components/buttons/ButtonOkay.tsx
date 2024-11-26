import styles from './Buttons.module.scss';

interface IProps {
  onClick: () => void;
}

function ButtonOkay({ onClick }: IProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.okayBtn}>
      OK
    </button>
  );
}

export default ButtonOkay;
