import { IconCirclePlus } from '@Components/svg';

import styles from './Buttons.module.scss';

interface IProps {
  buttonText: string;
  onClick: () => void;
}

function ButtonAddEntry(props: IProps): React.JSX.Element {
  const { buttonText, onClick } = props;

  return (
    <button type="button" onClick={onClick} className={styles.addEntryBtn}>
      <IconCirclePlus svgClass={styles.addEntryBtn__svg} />
      {buttonText}
    </button>
  );
}

export default ButtonAddEntry;
