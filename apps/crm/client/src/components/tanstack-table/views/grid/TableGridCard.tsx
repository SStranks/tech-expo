import styles from './_TableGridCard.module.scss';

interface IProps {
  upperSection: JSX.Element;
  lowerSection: JSX.Element;
}

function TableGridCard(props: IProps): JSX.Element {
  const { upperSection, lowerSection } = props;

  return (
    <div className={styles.tableGridCard}>
      <div className={styles.tableGridCard__upper}>{upperSection}</div>
      <div className={styles.tableGridCard__lower}>{lowerSection}</div>
    </div>
  );
}

export default TableGridCard;
