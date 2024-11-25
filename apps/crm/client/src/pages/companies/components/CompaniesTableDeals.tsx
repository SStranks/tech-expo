import { ButtonAddEntry } from '#Components/buttons';
import { TableSingleColumn } from '#Components/general';
import { IconPipe } from '#Components/svg';
import { TableCompaniesDeals } from '#Components/tanstack-table/tables';
import { tableDataDeals } from '#Data/MockData';

import styles from './_CompaniesTableDeals.module.scss';

// TODO:  Make 'Stage' icons for table

// TODO:  Make dynamic; add all deals
const totalDealsAmount = '$27,000,000';

// TEMP: .
const onClick = () => {
  console.log('Fired');
};

function CompaniesTableDeals(): JSX.Element {
  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className={styles.header}>
          <div className={styles.header__contacts}>
            <IconPipe svgClass={styles.header__svg} />
            <span className={styles.header__title}>Deals</span>
          </div>
          <div>
            <span className={styles.header__total}>Total Deals Amount: {totalDealsAmount}</span>
          </div>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <TableCompaniesDeals tableData={tableDataDeals} />
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.addEntryBtn}>
          <ButtonAddEntry buttonText="Add Deals to Pipeline" onClick={onClick} />
        </div>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableDeals;
