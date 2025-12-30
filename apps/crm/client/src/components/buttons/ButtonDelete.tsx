import styles from './Buttons.module.scss';

interface Props {
  disabled?: boolean;
}

function ButtonDelete({ disabled }: Props): React.JSX.Element {
  return (
    <button type="submit" disabled={disabled} className={styles.deleteBtn}>
      Delete
    </button>
  );
}

export default ButtonDelete;
