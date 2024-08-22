import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import { TableQuotes } from '#Components/tanstack-table/tables';
import { tableDataQuotes } from '#Data/MockData';

function QuotesPage(): JSX.Element {
  return (
    <>
      <TableQuotes tableData={tableDataQuotes} />
      <OutletPortalTransition />
    </>
  );
}

export default QuotesPage;
