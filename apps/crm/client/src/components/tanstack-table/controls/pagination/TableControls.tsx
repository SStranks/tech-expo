import type { Updater } from '@tanstack/react-table';
import ButtonPaginatorRowLimit from '#Components/buttons/paginator-pages/ButtonPaginatorRowLimit';
import TablePaginatorControl from './TablePaginatorControl';
import styles from './_TableControls.module.scss';

interface IProps {
  entriesName: string;
  entriesTotal: number;
  pageIndex: number;
  getPageCount: () => number;
  setPageIndex: (updater: Updater<number>) => void;
  setPageSize: (updater: Updater<number>) => void;
}

function TableControls(props: IProps): JSX.Element {
  const { entriesName, entriesTotal, pageIndex, getPageCount, setPageIndex, setPageSize } = props;
  return (
    <div className={styles.tableControls}>
      <div className={styles.information}>
        <p>
          <span className={styles.information__total}>{entriesTotal}</span> {` ${entriesName} in total`}
        </p>
      </div>
      <div className={styles.paginator}>
        <TablePaginatorControl pageCount={getPageCount()} pageIndex={pageIndex} setPageIndex={setPageIndex} />
      </div>
      <ButtonPaginatorRowLimit setPageSize={setPageSize} />
    </div>
  );
}

export default TableControls;
