import { Button, Menu, MenuTrigger, Popover } from 'react-aria-components';

import IconMenuDots from '@Components/svg/IconMenuDots';

import styles from './Buttons.module.scss';

type TPlacementValues = 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';

type Props = {
  buttonAriaLabel: string;
  popoverPlacement: TPlacementValues;
};

function ButtonOptions(props: Props): React.JSX.Element {
  const { buttonAriaLabel, popoverPlacement } = props;

  return (
    <MenuTrigger>
      <Button className={styles.optionsBtn} aria-label={buttonAriaLabel}>
        <IconMenuDots svgClass={styles.optionsBtn__svg} />
      </Button>
      <Popover placement={popoverPlacement} className={styles.optionsBtn__popover}>
        <Menu className={styles.optionsBtn__menu}>
          {/* <MenuItem onAction={() => alert('open')} className={styles.optionsBtn__menuItem}>
            Delete Company
          </MenuItem> */}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default ButtonOptions;
