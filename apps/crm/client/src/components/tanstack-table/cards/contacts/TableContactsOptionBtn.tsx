import type { CoreRow } from '@tanstack/react-table';

import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';

import IconDelete from '@Components/svg/IconDelete';
import IconEye from '@Components/svg/IconEye';
import IconMenuDots from '@Components/svg/IconMenuDots';
import { ITableDataContacts } from '@Data/MockData';

import styles from './TableContactsOptionBtn.module.scss';

interface Props {
  rowOriginal: CoreRow<ITableDataContacts>['original'];
}

function TableContactsOptionBtn(props: Props): React.JSX.Element {
  const { rowOriginal } = props;
  const navigate = useNavigate();

  return (
    <MenuTrigger>
      <Button className={styles.contactsOptionBtn} aria-label="Companies Option Menu">
        <IconMenuDots svgClass={styles.contactsOptionBtn__svg} />
      </Button>
      <Popover placement="bottom right" className={styles.contactsOptionBtn__popover}>
        <Menu className={styles.contactsOptionBtn__menu}>
          <MenuItem onAction={() => navigate(`read/${rowOriginal.id}`)} className={styles.contactsOptionBtn__menuItem}>
            <IconEye svgClass={styles.contactsOptionBtn__menuItem__svg} />
            <span>View Contact</span>
          </MenuItem>
          <MenuItem
            onAction={() => navigate(`delete/${rowOriginal.id}`, { state: rowOriginal })}
            className={styles.contactsOptionBtn__menuItemWarning}>
            <IconDelete svgClass={styles.contactsOptionBtn__menuItemWarning__svg} />
            <span>Delete Contact</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default TableContactsOptionBtn;
