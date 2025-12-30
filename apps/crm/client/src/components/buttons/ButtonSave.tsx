import type { InputHTMLAttributes } from 'react';

import styles from './Buttons.module.scss';

interface Props extends InputHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  name: string;
}

function ButtonSave({ disabled, name, onClick, ...rest }: Props): React.JSX.Element {
  return (
    <button {...rest} type="submit" name={name} onClick={onClick} disabled={disabled} className={styles.saveBtn}>
      Save
    </button>
  );
}

export default ButtonSave;
