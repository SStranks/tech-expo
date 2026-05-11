import type { CoreRow } from '@tanstack/react-table';

import type { TableDataContacts } from '@Data/MockData';

import { useNavigate } from '@tanstack/react-router';
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import IconDelete from '@Components/svg/IconDelete';
import IconEye from '@Components/svg/IconEye';
import IconMenuDots from '@Components/svg/IconMenuDots';

import styles from './TableContactsOptionBtn.module.scss';

type Props = {
  rowOriginal: CoreRow<TableDataContacts>['original'];
};

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
          <MenuItem
            onAction={() => void navigate({ params: { id: rowOriginal.id }, to: '/contacts/$id' })}
            className={styles.contactsOptionBtn__menuItem}>
            <IconEye svgClass={styles.contactsOptionBtn__menuItem__svg} />
            <span>View Contact</span>
          </MenuItem>
          <MenuItem
            onAction={() =>
              void navigate({ params: { id: rowOriginal.id }, state: { rowOriginal }, to: '/contacts/delete/$id' })
            }
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
