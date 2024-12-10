import { useId, useState } from 'react';

import { IconCirclePlus } from '@Components/svg';

import QuoteFinancialsItem from './QuoteFinancialsItem';

import styles from './QuoteFinancials.module.scss';

function QuoteFinancials(): React.JSX.Element {
  const [serviceItems, setServiceItems] = useState<JSX.Element[]>([]);
  const id = useId();

  const addServiceBtnClickHandler = () => {
    setServiceItems((prev) => [...prev, <QuoteFinancialsItem key={id} />]);
  };

  return (
    <div className={styles.quoteFinancialsTable}>
      <div className={styles.quoteFinancialsTable__header}>
        <span>Title</span>
        <span>Unit Price</span>
        <span>Quantity</span>
        <span>Discount</span>
        <span>Total Price</span>
      </div>
      <div className={styles.quoteFinancialsTable__services}>{serviceItems}</div>
      <button onClick={addServiceBtnClickHandler} className={styles.quoteFinancialsTable__addService}>
        <IconCirclePlus svgClass={styles.quoteFinancialsTable__addService__svg} />
        Add new service
      </button>
    </div>
  );
}

export default QuoteFinancials;
