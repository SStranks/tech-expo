import styles from './_TableGridView.module.scss';

interface IProps {
  tableCards: JSX.Element[];
}

function TableGridView(props: IProps): JSX.Element {
  const { tableCards } = props;

  return <div className={styles.tableGridView}>{tableCards}</div>;
}

export default TableGridView;
