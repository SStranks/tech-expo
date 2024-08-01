import { TableSingleColumn } from '#Components/general';

function CompaniesTableNotes(): JSX.Element {
  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className="">
          {/* icon */}
          <span>Notes</span>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <span>NOTES COMPONENTS</span>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableNotes;
