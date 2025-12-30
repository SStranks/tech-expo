import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import IconDelete from '@Components/svg/IconDelete';
import IconEye from '@Components/svg/IconEye';
import IconMenuDots from '@Components/svg/IconMenuDots';

import styles from './ScrumboardColumnOptionsBtn.module.scss';

type Props = {
  stageId: string;
  stageTitle: string;
};

function ScrumboardColumnOptionsBtn({ stageId, stageTitle }: Props): React.JSX.Element {
  return (
    <MenuTrigger>
      <Button className={styles.scrumboardOptionBtn} aria-label="Companies Option Menu">
        <IconMenuDots svgClass={styles.scrumboardOptionBtn__svg} />
      </Button>
      <Popover placement="bottom right" className={styles.scrumboardOptionBtn__popover}>
        <Menu className={styles.scrumboardOptionBtn__menu}>
          <MenuItem
            href={`pipeline/stage/update/${stageId}`}
            routerOptions={{ state: { stageId, stageTitle } }}
            className={styles.scrumboardOptionBtn__menuItem}>
            <IconEye svgClass={styles.scrumboardOptionBtn__menuItem__svg} />
            <span>Edit Status</span>
          </MenuItem>
          <MenuItem
            href={`pipeline/stage/delete/${stageId}`}
            routerOptions={{ state: { stageId, stageTitle } }}
            className={styles.scrumboardOptionBtn__menuItemWarning}>
            <IconDelete svgClass={styles.scrumboardOptionBtn__menuItemWarning__svg} />
            <span>Delete Status</span>
          </MenuItem>
          <MenuItem
            href={`pipeline/deals/delete/${stageId}`}
            routerOptions={{ state: { stageId } }}
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
