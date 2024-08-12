import { ButtonAddEntry } from '#Components/buttons';
import { TableSingleColumn } from '#Components/general';
import { IconBillQuote } from '#Components/svg';
import { TableCompaniesQuotes } from '#Components/tanstack-table/tables';
import { tableDataQuotes } from '#Data/MockData';
import styles from './_CompaniesTableQuotes.module.scss';

// TEMP: .
const onClick = () => {
  console.log('Fired');
};

function CompaniesTableQuotes(): JSX.Element {
  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className={styles.header}>
          <IconBillQuote svgClass={styles.header__svg} />
          <span className={styles.header__title}>Quotes</span>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <TableCompaniesQuotes tableData={tableDataQuotes} />
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.addEntryBtn}>
          <ButtonAddEntry buttonText="Add Quotes" onClick={onClick} />
        </div>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableQuotes;
