import { TableCompanies } from '#Components/tanstack-table/tables';
import { tableDataCompanies } from '#Data/MockData';
import ViewportLayout from '#Layouts/ViewportLayout';
import styles from './_CompaniesRoute.module.scss';

function CompaniesRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <div className={styles.contactsRouteLayout}>
        <div className={styles.table}>
          <TableCompanies tableData={tableDataCompanies} />
        </div>
      </div>
    </ViewportLayout>
  );
}

export default CompaniesRoute;
