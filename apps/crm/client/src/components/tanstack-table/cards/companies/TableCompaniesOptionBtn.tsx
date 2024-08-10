import type { CoreRow } from '@tanstack/react-table';
import type { ITableDataCompanies } from '#Data/MockData';
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { IconDelete, IconEye, IconMenuDots } from '#Components/svg';
import styles from './_TableCompaniesOptionBtn.module.scss';

// NOTE:  // HACK:  Need to extract this functionality; create wrapper components for aria-components that utilize modal functionality (and set padding-right on <html>).
// NOTE:  Is this even necessary now? No scrollbar seems to be appeared anymore?
// const temp = (open: boolean) => {
//   const scrollbarTrackBackground = getComputedStyle(document.querySelector('body')!).getPropertyValue(
//     '--thm-background-default'
//   );
//   if (open) {
//     document.documentElement.style.backgroundColor = scrollbarTrackBackground;
//   } else {
//     document.documentElement.style.removeProperty('background-color');
//   }
// };

// console.log(temp);

interface IProps {
  rowOriginal: CoreRow<ITableDataCompanies>['original'];
}

function TableCompaniesOptionBtn(props: IProps): JSX.Element {
  const { rowOriginal } = props;
  const navigate = useNavigate();

  return (
    // <MenuTrigger onOpenChange={(open) => temp(open)}>
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
