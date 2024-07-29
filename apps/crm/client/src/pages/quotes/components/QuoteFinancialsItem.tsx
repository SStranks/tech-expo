import { IconDelete } from '#Components/svg';
import styles from './_QuoteFinancialsItem.module.scss';

const deleteItemClickHandler = () => {
  console.log('delete');
};

function QuoteFinancialsItem(): JSX.Element {
  return (
    <div className={styles.quoteFinancialsItem}>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <span>$27.00</span>
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <span>$27.00</span>
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <span>$27.00</span>
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <span>$27.00</span>
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <span>$27.00</span>
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <button onClick={deleteItemClickHandler} className={styles.quoteFinancialsItem__deleteBtn}>
          <IconDelete />
        </button>
      </div>
    </div>
  );
}

export default QuoteFinancialsItem;
