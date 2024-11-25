import type { CoreRow } from '@tanstack/react-table';
import type { ITableDataCompanies } from '#Data/MockData';

import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';

import { IconDelete, IconEye, IconMenuDots } from '#Components/svg';

import styles from './_TableCompaniesOptionBtn.module.scss';

interface IProps {
  rowOriginal: CoreRow<ITableDataCompanies>['original'];
}

function TableCompaniesOptionBtn(props: IProps): JSX.Element {
  const { rowOriginal } = props;
  const navigate = useNavigate();

  return (
    <MenuTrigger>
      <Button className={styles.companiesOptionBtn} aria-label="Companies Option Menu">
        <IconMenuDots svgClass={styles.companiesOptionBtn__svg} />
      </Button>
      <Popover placement="bottom right" className={styles.companiesOptionBtn__popover}>
        <Menu className={styles.companiesOptionBtn__menu}>
          <MenuItem onAction={() => navigate(`read/${rowOriginal.id}`)} className={styles.companiesOptionBtn__menuItem}>
            <IconEye svgClass={styles.companiesOptionBtn__menuItem__svg} />
            <span>View Company</span>
          </MenuItem>
          <MenuItem
            onAction={() => navigate(`delete/${rowOriginal.id}`, { state: rowOriginal })}
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
