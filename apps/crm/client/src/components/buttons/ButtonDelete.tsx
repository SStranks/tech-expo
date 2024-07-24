import styles from './_Buttons.module.scss';

interface IProps {
  disabled?: boolean;
}

function ButtonDelete({ disabled }: IProps): JSX.Element {
  return (
    <button type="submit" disabled={disabled} className={styles.deleteBtn}>
      Delete
    </button>
  );
}

export default ButtonDelete;
