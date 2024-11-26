import styles from './Buttons.module.scss';

interface IProps {
  onClick: () => void;
}

function ButtonCancel({ onClick }: IProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.cancelBtn}>
      Cancel
    </button>
  );
}

export default ButtonCancel;
