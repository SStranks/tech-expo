import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { IconDelete, IconEye, IconMenuDots } from '#Components/svg';
import styles from './_ScrumboardCardOptionsBtn.module.scss';

interface IProps {
  taskId: string;
  columnId: string;
  taskStatus?: 'won' | 'lost';
}

function ScrumboardCardOptionsBtn({ taskId, columnId, taskStatus }: IProps): JSX.Element {
  return (
    <MenuTrigger>
      <Button
        className={`${styles.cardOptionsBtn} ${taskStatus ? styles[`cardOptionsBtn--${taskStatus}`] : ''}`}
        aria-label="Companies Option Menu">
        <IconMenuDots svgClass={styles.cardOptionsBtn__svg} />
      </Button>
      <Popover placement="bottom right" className={styles.cardOptionsBtn__popover}>
        <Menu className={styles.cardOptionsBtn__menu}>
          <MenuItem
            href={`pipeline/deal/update/${taskId}`}
            routerOptions={{ state: { taskId } }}
            className={styles.cardOptionsBtn__menuItem}>
            <IconEye svgClass={styles.cardOptionsBtn__menuItem__svg} />
            <span>View Card</span>
          </MenuItem>
          <MenuItem
            href={`pipeline/deal/delete/${taskId}`}
            routerOptions={{ state: { columnId, taskId } }}
            className={styles.cardOptionsBtn__menuItemWarning}>
            <IconDelete svgClass={styles.cardOptionsBtn__menuItemWarning__svg} />
            <span>Delete Card</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default ScrumboardCardOptionsBtn;
