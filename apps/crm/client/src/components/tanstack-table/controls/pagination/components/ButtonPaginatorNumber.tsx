import styles from './ButtonPaginator.module.scss';

interface Props {
  number: number;
  active: boolean;
  onClick: () => void;
}

function ButtonPaginatorNumber(props: Props): React.JSX.Element {
  const { active, number, onClick } = props;

  return (
    <button
      onClick={onClick}
      title={number.toString()}
      className={`${styles.button} ${active ? styles.button__active : ''}`}>
      <span className={styles.button__number}>{number}</span>
    </button>
  );
}

export default ButtonPaginatorNumber;
