import { TableQuotes } from '#Components/tanstack-table/tables';
import { tableDataQuotes } from '#Data/MockData';
import styles from './_QuotesPage.module.scss';

function QuotesPage(): JSX.Element {
  return (
    <div className={styles.table}>
      <TableQuotes tableData={tableDataQuotes} />
    </div>
  );
}

export default QuotesPage;
