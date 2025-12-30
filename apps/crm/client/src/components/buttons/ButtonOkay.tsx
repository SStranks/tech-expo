import styles from './Buttons.module.scss';

type Props = {
  onClick: () => void;
};

function ButtonOkay({ onClick }: Props): React.JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.okayBtn}>
      OK
    </button>
  );
}

export default ButtonOkay;
