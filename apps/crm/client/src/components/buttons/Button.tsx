import { IIcon } from '@Components/svg';

import styles from './Button.module.scss';

type TType = 'primary' | 'secondary' | 'quaternary';

interface IProps {
  buttonClickFn?: (data?: unknown) => void;
  buttonDisabled?: boolean;
  ButtonIcon?: IIcon;
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
  ButtonIcon = undefined,
  buttonShape = 'default',
  buttonSize = 'default',
  buttonStyle = 'primary',
  buttonText = undefined,
  form = undefined,
  type = 'button',
}: IProps): React.JSX.Element {
  const clickHandler = () => {
    if (buttonClickFn) buttonClickFn();
  };

  const text = buttonText ? <span className={styles.button__text}>{buttonText}</span> : false;
  const icon = ButtonIcon ? <ButtonIcon /> : false;
  const iconOnly = !!(!buttonText && ButtonIcon);
  const classes = `${styles.button} ${styles[`type--${buttonStyle}`]} ${styles[`size--${buttonSize}`]} ${styles[`shape--${buttonShape}`]} ${iconOnly ? styles.iconOnly : ''}`;

  return (
    <button type={type} form={form} onClick={clickHandler} disabled={buttonDisabled} className={classes}>
      {text}
      {icon}
    </button>
  );
}

export default Button;
