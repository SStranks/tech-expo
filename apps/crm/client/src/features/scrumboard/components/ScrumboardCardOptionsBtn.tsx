import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { IconDelete, IconEye, IconMenuDots } from '#Components/svg';
import styles from './_ScrumboardCardOptionsBtn.module.scss';

function ScrumboardCardOptionsBtn(): JSX.Element {
  return (
    <MenuTrigger>
      <Button className={styles.companiesOptionBtn} aria-label="Companies Option Menu">
        <IconMenuDots svgClass={styles.companiesOptionBtn__svg} />
      </Button>
      <Popover placement="bottom right" className={styles.companiesOptionBtn__popover}>
        <Menu className={styles.companiesOptionBtn__menu}>
          <MenuItem onAction={() => console.log('Options Fire')} className={styles.companiesOptionBtn__menuItem}>
            <IconEye svgClass={styles.companiesOptionBtn__menuItem__svg} />
            <span>View Card</span>
          </MenuItem>
          <MenuItem onAction={() => console.log('Options Fire')} className={styles.companiesOptionBtn__menuItemWarning}>
            <IconDelete svgClass={styles.companiesOptionBtn__menuItemWarning__svg} />
            <span>Delete Card</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default ScrumboardCardOptionsBtn;
