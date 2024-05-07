import styles from './_Buttons.module.scss';

interface IProps {
  disabled?: boolean;
}

function ButtonSave({ disabled }: IProps): JSX.Element {
  return (
    <button type="submit" disabled={disabled} className={styles.saveBtn}>
      Save
    </button>
  );
}

export default ButtonSave;
