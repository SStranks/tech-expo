import { useState } from 'react';

import styles from './QuoteStatusUpdater.module.scss';

type QuoteStatus = 'draft' | 'sent' | 'accepted';

function QuoteStatusUpdater(): React.JSX.Element {
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>('draft');

  const statusBtnClickHandler = (status: QuoteStatus) => {
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
