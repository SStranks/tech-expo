import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import { TableCompanies } from '#Components/tanstack-table/tables';
import { tableDataCompanies } from '#Data/MockData';

function CompaniesPage(): JSX.Element {
  return (
    <>
      <TableCompanies tableData={tableDataCompanies} />
      <OutletPortalTransition />
    </>
  );
}

export default CompaniesPage;
