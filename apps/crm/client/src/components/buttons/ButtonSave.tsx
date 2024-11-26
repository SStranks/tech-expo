import styles from './Buttons.module.scss';

interface IProps {
  disabled?: boolean;
  onClick: () => void;
}

function ButtonSave({ disabled, onClick }: IProps): JSX.Element {
  return (
    <button type="submit" onClick={onClick} disabled={disabled} className={styles.saveBtn}>
      Save
    </button>
  );
}

export default ButtonSave;
