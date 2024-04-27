import ButtonPaginatorRowLimit from '#Components/buttons/paginator-pages/ButtonPaginatorRowLimit';
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
      <div className={styles.information}>
        <p>
          <span className={styles.information__total}>{entriesTotal}</span> {` ${entriesName} in total`}
        </p>
      </div>
      <div className={styles.paginator}>
        <TablePaginatorControl numberOfPages={10} />
      </div>
      <ButtonPaginatorRowLimit />
    </div>
  );
}

export default TableControls;
