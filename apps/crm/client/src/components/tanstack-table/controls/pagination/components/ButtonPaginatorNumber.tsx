import styles from './_ButtonPaginator.module.scss';

interface IProps {
  number: number;
  active: boolean;
  onClick: () => void;
}

function ButtonPaginatorNumber(props: IProps): JSX.Element {
  const { number, active, onClick } = props;

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
