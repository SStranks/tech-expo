import styles from './_TableCompaniesCardUpper.module.scss';

interface IProps {
  companyLogo: string;
  companyTitle: string;
  openDealsAmount: string;
}

function TableCompaniesCardUpper(props: IProps): JSX.Element {
  const { companyLogo, companyTitle, openDealsAmount } = props;

  return (
    <div className={styles.companiesCardUpper}>
      <img src={companyLogo} alt="" className={styles.companiesCardUpper__companyLogo} />
      <span className={styles.companiesCardUpper__companyTitle}>{companyTitle}</span>
      <span>Open deals amount</span>
      <span className={styles.companiesCardUpper__openDealsAmount}>{openDealsAmount}</span>
    </div>
  );
}

export default TableCompaniesCardUpper;
