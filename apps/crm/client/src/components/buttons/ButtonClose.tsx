import { IconClose } from '@Components/svg';

import styles from './Buttons.module.scss';

interface IProps {
  onClick?: (data?: unknown) => void;
}

function ButtonClose(props: IProps): React.JSX.Element {
  const { onClick } = props;

  return (
    <button type="button" onClick={onClick} className={styles.closeBtn}>
      <IconClose svgClass={styles.closeBtn__svg} />
    </button>
  );
}

export default ButtonClose;
