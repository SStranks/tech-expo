import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { IconDelete, IconEye, IconMenuDots } from '#Components/svg';
import styles from './_ScrumboardCardOptionsBtn.module.scss';

interface IProps {
  taskStatus?: 'won' | 'lost';
}

function ScrumboardCardOptionsBtn({ taskStatus }: IProps): JSX.Element {
  return (
    <MenuTrigger>
      <Button
        className={`${styles.cardOptionsBtn} ${taskStatus ? styles[`cardOptionsBtn--${taskStatus}`] : ''}`}
        aria-label="Companies Option Menu">
        <IconMenuDots svgClass={styles.cardOptionsBtn__svg} />
      </Button>
      <Popover placement="bottom right" className={styles.cardOptionsBtn__popover}>
        <Menu className={styles.cardOptionsBtn__menu}>
          <MenuItem onAction={() => console.log('Options Fire')} className={styles.cardOptionsBtn__menuItem}>
            <IconEye svgClass={styles.cardOptionsBtn__menuItem__svg} />
            <span>View Card</span>
          </MenuItem>
          <MenuItem onAction={() => console.log('Options Fire')} className={styles.cardOptionsBtn__menuItemWarning}>
            <IconDelete svgClass={styles.cardOptionsBtn__menuItemWarning__svg} />
            <span>Delete Card</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default ScrumboardCardOptionsBtn;
