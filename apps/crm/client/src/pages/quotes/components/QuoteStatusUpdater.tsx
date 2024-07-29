import { useState } from 'react';
import styles from './_QuoteStatusUpdater.module.scss';

type TQuoteStatus = 'draft' | 'sent' | 'accepted';

function QuoteStatusUpdater(): JSX.Element {
  const [quoteStatus, setQuoteStatus] = useState<TQuoteStatus>('draft');

  const statusBtnClickHandler = (status: TQuoteStatus) => {
    setQuoteStatus(status);
  };

  return (
    <div className={`${styles.quoteStatusUpdater} ${styles[`${quoteStatus}`]}`}>
      <button onClick={() => statusBtnClickHandler('draft')} className={styles.quoteStatusUpdater__draft}>
        <span>Draft</span>
      </button>
      <button onClick={() => statusBtnClickHandler('sent')} className={styles.quoteStatusUpdater__sent}>
        <span>Sent</span>
      </button>
      <button onClick={() => statusBtnClickHandler('accepted')} className={styles.quoteStatusUpdater__accepted}>
        <span>Accepted</span>
      </button>
    </div>
  );
}

export default QuoteStatusUpdater;
