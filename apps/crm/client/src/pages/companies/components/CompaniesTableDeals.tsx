import { TableSingleColumn } from '#Components/general';
import { IconCirclePlus } from '#Components/svg';

const totalDealsAmount = '$27,000,000';

function CompaniesTableDeals(): JSX.Element {
  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className="">
          <div className="">
            {/* icon */}
            <span>Deals</span>
          </div>
          <div className="">
            <span>Total Deals Amount: {totalDealsAmount}</span>
          </div>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <span>No deals yet</span>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <IconCirclePlus svgClass="" />
        <span>Add Deals via Pipeline</span>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableDeals;
