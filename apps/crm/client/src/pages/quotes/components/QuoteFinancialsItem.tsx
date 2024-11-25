import { IconDelete } from '#Components/svg';

import styles from './_QuoteFinancialsItem.module.scss';

const deleteItemClickHandler = () => {
  console.log('delete');
};

function QuoteFinancialsItem(): JSX.Element {
  return (
    <div className={styles.quoteFinancialsItem}>
      <div className={styles.quoteFinancialsItem__gridItem}>
        {/* // NOTE:  PLACEHOLDER */}
        {/* // TODO:  Need to make input aria component; also utilize in login forms*/}
        <input type="text" className={styles.inputTemp} />
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <input type="text" className={styles.inputTemp} />
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <input type="text" className={styles.inputTemp} />
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <input type="text" className={styles.inputTemp} />
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <span>$27.00</span>
      </div>
      <div className={styles.quoteFinancialsItem__gridItem}>
        <button onClick={deleteItemClickHandler} className={styles.quoteFinancialsItem__deleteBtn}>
          <IconDelete svgClass={styles.quoteFinancialsItem__deleteBtn__svg} />
        </button>
      </div>
    </div>
  );
}

export default QuoteFinancialsItem;
