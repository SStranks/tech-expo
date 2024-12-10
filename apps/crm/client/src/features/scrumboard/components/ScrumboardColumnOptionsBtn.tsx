import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import { IconDelete, IconEye, IconMenuDots } from '@Components/svg';

import styles from './ScrumboardColumnOptionsBtn.module.scss';

interface IProps {
  columnId: string;
  columnTitle: string;
}

function ScrumboardColumnOptionsBtn({ columnId, columnTitle }: IProps): React.JSX.Element {
  return (
    <MenuTrigger>
      <Button className={styles.scrumboardOptionBtn} aria-label="Companies Option Menu">
        <IconMenuDots svgClass={styles.scrumboardOptionBtn__svg} />
      </Button>
      <Popover placement="bottom right" className={styles.scrumboardOptionBtn__popover}>
        <Menu className={styles.scrumboardOptionBtn__menu}>
          <MenuItem
            href={`pipeline/stage/update/${columnId}`}
            routerOptions={{ state: { columnId, columnTitle } }}
            className={styles.scrumboardOptionBtn__menuItem}>
            <IconEye svgClass={styles.scrumboardOptionBtn__menuItem__svg} />
            <span>Edit Status</span>
          </MenuItem>
          <MenuItem
            href={`pipeline/stage/delete/${columnId}`}
            routerOptions={{ state: { columnId, columnTitle } }}
            className={styles.scrumboardOptionBtn__menuItemWarning}>
            <IconDelete svgClass={styles.scrumboardOptionBtn__menuItemWarning__svg} />
            <span>Delete Status</span>
          </MenuItem>
          <MenuItem
            href={`pipeline/deals/delete/${columnId}`}
            routerOptions={{ state: { columnId } }}
            className={styles.scrumboardOptionBtn__menuItemWarning}>
            <IconDelete svgClass={styles.scrumboardOptionBtn__menuItemWarning__svg} />
            <span>Delete Cards</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default ScrumboardColumnOptionsBtn;
