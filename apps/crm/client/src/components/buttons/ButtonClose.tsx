import IconClose from '@Components/svg/IconClose';

import styles from './Buttons.module.scss';

type Props = {
  onClick?: (data?: unknown) => void;
};

function ButtonClose(props: Props): React.JSX.Element {
  const { onClick } = props;

  return (
    <button type="button" onClick={onClick} className={styles.closeBtn}>
      <IconClose svgClass={styles.closeBtn__svg} />
    </button>
  );
}

export default ButtonClose;
