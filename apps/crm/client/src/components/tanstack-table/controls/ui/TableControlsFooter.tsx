import type { Updater } from '@tanstack/react-table';

import { PaginatorRangeControl } from '../';
import ButtonPaginatorRowLimit from '../pagination/components/ButtonPaginatorRowLimit';

import styles from './TableControlsFooter.module.scss';

interface IProps {
  entriesName: string;
  entriesTotal: number;
  pageIndex: number;
  getPageCount: () => number;
  setPageIndex: (updater: Updater<number>) => void;
  setPageSize: (updater: Updater<number>) => void;
}

function TableControlsFooter(props: IProps): JSX.Element {
  const { entriesName, entriesTotal, getPageCount, pageIndex, setPageIndex, setPageSize } = props;

  return (
    <div className={styles.tableControls}>
      <div className={styles.information}>
        <p>
          <span className={styles.information__total}>{entriesTotal}</span> {` ${entriesName} in total`}
        </p>
      </div>
      <div className={styles.paginator}>
        <PaginatorRangeControl pageCount={getPageCount()} pageIndex={pageIndex} setPageIndex={setPageIndex} />
      </div>
      <ButtonPaginatorRowLimit setPageSize={setPageSize} />
    </div>
  );
}

export default TableControlsFooter;
