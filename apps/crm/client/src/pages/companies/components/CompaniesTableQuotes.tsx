import { TableSingleColumn } from '#Components/general';
import { IconCirclePlus } from '#Components/svg';

function CompaniesTableQuotes(): JSX.Element {
  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className="">
          {/* icon */}
          <span>Quotes</span>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <span>No quotes yet</span>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <IconCirclePlus svgClass="" />
        <span>Add Quote</span>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableQuotes;
