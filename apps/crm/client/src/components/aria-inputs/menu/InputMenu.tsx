import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

interface IProps {
  buttonContent: JSX.Element;
  styles: { [key: string]: string };
}

function InputMenu(props: IProps): JSX.Element {
  const { buttonContent, styles } = props;

  return (
    <MenuTrigger>
      <Button className={styles.inputMenu__btn} aria-label="Menu">
        {buttonContent}
      </Button>
      <Popover className={styles.inputMenu__popover}>
        <Menu className={styles.inputMenu__menu}>
          <MenuItem onAction={() => alert('open')} className={styles.inputMenu__menuItem}>
            Open
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default InputMenu;
