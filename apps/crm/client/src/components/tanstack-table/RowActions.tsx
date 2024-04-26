import { IconDelete, IconEye, IconPhone } from '#Components/svg';
import styles from './_RowActions.module.scss';

const actionViewClickHandler = () => {
  console.log('view click');
};

const actionEditClickHandler = () => {
  console.log('edit click');
};

const actionDeleteClickHandler = () => {
  console.log('delete click');
};

function RowActions(): JSX.Element {
  return (
    <div className={styles.rowActions}>
      <button type="button" onClick={actionViewClickHandler} className={styles.button}>
        <IconEye svgClass={styles.svg} />
      </button>
      <button type="button" onClick={actionEditClickHandler} className={styles.button}>
        <IconPhone svgClass={styles.svg} />
      </button>
      <button type="button" onClick={actionDeleteClickHandler} className={styles.buttonDelete}>
        <IconDelete svgClass={styles.svg} />
      </button>
    </div>
  );
}

export default RowActions;
