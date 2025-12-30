import type { Updater } from '@tanstack/react-table';

import ButtonPaginatorRowLimit from '../pagination/components/ButtonPaginatorRowLimit';
import PaginatorRangeControl from '../pagination/PaginatorRangeControl';

import styles from './TableControlsFooter.module.scss';

type Props = {
  entriesName: string;
  entriesTotal: number;
  pageIndex: number;
  getPageCount: () => number;
  setPageIndex: (updater: Updater<number>) => void;
  setPageSize: (updater: Updater<number>) => void;
};

function TableControlsFooter(props: Props): React.JSX.Element {
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
