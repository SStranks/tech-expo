import styles from './TableGridView.module.scss';

interface IProps {
  tableCards: React.JSX.Element[];
}

function TableGridView(props: IProps): React.JSX.Element {
  const { tableCards } = props;

  return <div className={styles.tableGridView}>{tableCards}</div>;
}

export default TableGridView;
