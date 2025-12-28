import EditableRow from '@Components/general/EditableRow';
import TableSingleColumn from '@Components/general/TableSingleColumn';
import IconCompanies from '@Components/svg/IconCompanies';

import styles from './CompaniesTableInformation.module.scss';

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

function CompaniesTableInformation(props: IProps): React.JSX.Element {
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
          <EditableRow IconSvg={IconCompanies} title="Company Size" description={companyInfo.size} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Company Revenue" description={companyInfo.revenue} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Company Industry" description={companyInfo.industry} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Company Type" description={companyInfo.type} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Country" description={companyInfo.country} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Website" description={companyInfo.website} />
        </div>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableInformation;
