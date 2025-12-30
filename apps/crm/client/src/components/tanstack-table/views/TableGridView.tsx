import styles from './TableGridView.module.scss';

type Props = {
  tableCards: React.JSX.Element[];
};

function TableGridView(props: Props): React.JSX.Element {
  const { tableCards } = props;

  return <div className={styles.tableGridView}>{tableCards}</div>;
}

export default TableGridView;
