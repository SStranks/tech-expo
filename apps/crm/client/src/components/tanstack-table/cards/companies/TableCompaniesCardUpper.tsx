import type { ITableDataCompanies } from '#Data/MockData';
import type { CoreRow } from '@tanstack/react-table';
import TableCompaniesOptionBtn from './TableCompaniesOptionBtn';
import styles from './_TableCompaniesCardUpper.module.scss';

interface IProps {
  rowOriginal: CoreRow<ITableDataCompanies>['original'];
}

function TableCompaniesCardUpper(props: IProps): JSX.Element {
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
