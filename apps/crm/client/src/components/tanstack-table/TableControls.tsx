import TablePaginatorControl from './TablePaginatorControl';
import styles from './_TableControls.module.scss';

interface IProps {
  entriesName: string;
  entriesTotal: number;
}

function TableControls(props: IProps): JSX.Element {
  const { entriesName, entriesTotal } = props;
  return (
    <div className={styles.tableControls}>
      <p className={styles.information}>
        <span>{entriesTotal}</span>
        {` ${entriesName} in total`}
      </p>
      <TablePaginatorControl />
    </div>
  );
}

export default TableControls;
