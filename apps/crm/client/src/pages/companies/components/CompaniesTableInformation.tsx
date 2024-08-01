import { TableSingleColumn } from '#Components/general';
import { IconCompanies, IconEdit } from '#Components/svg';
import styles from './_CompaniesTableInformation.module.scss';

interface ICompanyInfo {
  size: string;
  revenue: string;
  industry: string;
  type: string;
  country: string;
  website: string;
}

interface IProps {
  companyInfo: ICompanyInfo;
}

function CompaniesTableInformation(props: IProps): JSX.Element {
  const { companyInfo } = props;

  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className={styles.header}>
          <IconCompanies svgClass={styles.header__headerSvg} />
          <span className={styles.header__headerTitle}>Company Info</span>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <IconCompanies svgClass={styles.row__svg} />
          <div className={styles.row__details}>
            <span>Company Size</span>
            <span className={styles.row__details__value}>{companyInfo.size}</span>
          </div>
          <button className={styles.row__editBtn}>
            <IconEdit svgClass={styles.row__editBtn__svg} />
          </button>
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <IconCompanies svgClass={styles.row__svg} />
          <div className={styles.row__details}>
            <span>Company Revenue</span>
            <span className={styles.row__details__value}>{companyInfo.revenue}</span>
          </div>
          <button className={styles.row__editBtn}>
            <IconEdit svgClass={styles.row__editBtn__svg} />
          </button>
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <IconCompanies svgClass={styles.row__svg} />
          <div className={styles.row__details}>
            <span>Company Industry</span>
            <span className={styles.row__details__value}>{companyInfo.industry}</span>
          </div>
          <button className={styles.row__editBtn}>
            <IconEdit svgClass={styles.row__editBtn__svg} />
          </button>
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <IconCompanies svgClass={styles.row__svg} />
          <div className={styles.row__details}>
            <span>Company Type</span>
            <span className={styles.row__details__value}>{companyInfo.type}</span>
          </div>
          <button className={styles.row__editBtn}>
            <IconEdit svgClass={styles.row__editBtn__svg} />
          </button>
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <IconCompanies svgClass={styles.row__svg} />
          <div className={styles.row__details}>
            <span>Country</span>
            <span className={styles.row__details__value}>{companyInfo.country}</span>
          </div>
          <button className={styles.row__editBtn}>
            <IconEdit svgClass={styles.row__editBtn__svg} />
          </button>
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <IconCompanies svgClass={styles.row__svg} />
          <div className={styles.row__details}>
            <span>Website</span>
            <span className={styles.row__details__value}>{companyInfo.website}</span>
          </div>
          <button className={styles.row__editBtn}>
            <IconEdit svgClass={styles.row__editBtn__svg} />
          </button>
        </div>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableInformation;
