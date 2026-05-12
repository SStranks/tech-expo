import type { CoreRow } from '@tanstack/react-table';

import type { TableDataCompanies } from '@Data/MockData';

import { useNavigate } from '@tanstack/react-router';
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import IconDelete from '@Components/svg/IconDelete';
import IconEye from '@Components/svg/IconEye';
import IconMenuDots from '@Components/svg/IconMenuDots';

import styles from './TableCompaniesOptionBtn.module.scss';

type Props = {
  rowOriginal: CoreRow<TableDataCompanies>['original'];
};

function TableCompaniesOptionBtn(props: Props): React.JSX.Element {
  const { rowOriginal } = props;
  const navigate = useNavigate();

  return (
    <MenuTrigger>
      <Button className={styles.companiesOptionBtn} aria-label="Companies Option Menu">
        <IconMenuDots svgClass={styles.companiesOptionBtn__svg} />
      </Button>
      <Popover placement="bottom right" className={styles.companiesOptionBtn__popover}>
        <Menu className={styles.companiesOptionBtn__menu}>
          <MenuItem
            onAction={() => void navigate({ params: { id: rowOriginal.id }, to: '/companies/$id' })}
            className={styles.companiesOptionBtn__menuItem}>
            <IconEye svgClass={styles.companiesOptionBtn__menuItem__svg} />
            <span>View Company</span>
          </MenuItem>
          <MenuItem
            onAction={() => void navigate({ params: { id: rowOriginal.id }, to: '/companies/delete/$id' })}
            className={styles.companiesOptionBtn__menuItemWarning}>
            <IconDelete svgClass={styles.companiesOptionBtn__menuItemWarning__svg} />
            <span>Delete Company</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default TableCompaniesOptionBtn;
