import IconClose from '#Components/svg/IconClose';
import IconDelete from '#Components/svg/IconDelete';
import styles from './_Button.module.scss';

function IconSelect(iconName: TIcon, buttonType: TType): string | JSX.Element {
  switch (iconName) {
    case 'close': {
      return <IconClose appendClass={styles[`icon--${buttonType}`]} />;
    }
    case 'delete': {
      return <IconDelete />;
    }
  }
}

type TIcon = 'close' | 'delete';
type TType = 'primary' | 'secondary' | 'quaternary';

interface IProps {
  buttonClickFn?: (data?: unknown) => void;
  buttonDisabled?: boolean;
  buttonIcon?: TIcon;
  buttonShape?: 'default' | 'circle' | 'pill';
  buttonSize?: 'small' | 'default' | 'large';
  buttonStyle?: TType;
  buttonText?: string;
  type?: HTMLButtonElement['type'];
  form?: string;
}

function Button({
  buttonClickFn = undefined,
  buttonDisabled = undefined,
  buttonIcon = undefined,
  buttonShape = 'default',
  buttonSize = 'default',
  buttonStyle = 'primary',
  buttonText = undefined,
  type = 'button',
  form = undefined,
}: IProps): JSX.Element {
  const clickHandler = () => {
    if (buttonClickFn) buttonClickFn();
  };

  const text = buttonText ? <span className={styles.button__text}>{buttonText}</span> : false;
  const icon = buttonIcon ? IconSelect(buttonIcon, buttonStyle) : false;
  const iconOnly = !!(!buttonText && buttonIcon);
  const classes = `${styles.button} ${styles[`type--${buttonStyle}`]} ${styles[`size--${buttonSize}`]} ${styles[`shape--${buttonShape}`]} ${iconOnly ? styles.iconOnly : ''}`;

  return (
    <button type={type} form={form} onClick={clickHandler} disabled={buttonDisabled} className={classes}>
      {text}
      {icon}
    </button>
  );
}

export default Button;
