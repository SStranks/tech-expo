import styles from './Buttons.module.scss';

type Props = {
  onClick: () => void;
};

function ButtonCancel({ onClick }: Props): React.JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.cancelBtn}>
      Cancel
    </button>
  );
}

export default ButtonCancel;
