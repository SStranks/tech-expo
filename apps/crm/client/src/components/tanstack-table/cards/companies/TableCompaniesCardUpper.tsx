import type { Row, TableFeatures } from '@tanstack/react-table';

import type { TableDataCompanies } from '@Data/MockData';

import TableCompaniesOptionBtn from './TableCompaniesOptionBtn';

import styles from './TableCompaniesCardUpper.module.scss';

type Props<TFeatures extends TableFeatures> = {
  rowOriginal: Row<TFeatures, TableDataCompanies>['original'];
};

function TableCompaniesCardUpper<TFeatures extends TableFeatures>(props: Props<TFeatures>): React.JSX.Element {
  const { rowOriginal } = props;

  return (
    <div className={styles.companiesCardUpper}>
      <div className={styles.companiesCardUpper__optionsBtn}>
        <TableCompaniesOptionBtn rowOriginal={rowOriginal} />
      </div>
      <img src={rowOriginal.companyLogo} alt="" className={styles.companiesCardUpper__companyLogo} />
      <span className={styles.companiesCardUpper__companyTitle}>{rowOriginal.companyTitle}</span>
      <span>Open deals amount</span>
      <span className={styles.companiesCardUpper__openDealsAmount}>{rowOriginal.openDealsAmount}</span>
    </div>
  );
}

export default TableCompaniesCardUpper;
