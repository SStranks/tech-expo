import ButtonAddEntry from '@Components/buttons/ButtonAddEntry';
import TableSingleColumn from '@Components/general/TableSingleColumn';
import IconBillQuote from '@Components/svg/IconBillQuote';
import TableCompaniesQuotes from '@Components/tanstack-table/tables/companies/TableCompaniesQuotes';
import { tableDataQuotes } from '@Data/MockData';

import styles from './CompaniesTableQuotes.module.scss';

// TEMP: .
const onClick = () => {
  console.log('Fired');
};

function CompaniesTableQuotes(): React.JSX.Element {
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
