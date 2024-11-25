import { useState } from 'react';

import { TableSingleColumn } from '#Components/general';
import { IconArrowDownAlt, IconCircleTriangleRight } from '#Components/svg';
import { ContactStatus } from '#Components/tanstack-table/elements';

import styles from './_ContactLifecycle.module.scss';

function ContactLifecycle(): JSX.Element {
  const [lifecycle, setLifecycle] = useState<string>('new');

  console.log(lifecycle);

  const pillBtnClickHandler = (stage: string) => {
    setLifecycle(stage);
  };

  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className={styles.header}>
          <IconCircleTriangleRight svgClass={styles.header__svg} />
          <span className={styles.header__title}>Lifecycle Stage: </span>
          <ContactStatus status={'contacted'} />
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <div className={styles.tracker}>
          <div className={styles.tracker__container}>
            <button type="button" onClick={() => pillBtnClickHandler('new')} className={styles.tracker__pill}>
              <span className={styles.tracker__stage}>New</span>
            </button>
            <button type="button" onClick={() => pillBtnClickHandler('contacted')} className={styles.tracker__pill}>
              <span className={styles.tracker__stage}>Contacted</span>
            </button>
            <button type="button" onClick={() => pillBtnClickHandler('interested')} className={styles.tracker__pill}>
              <span className={styles.tracker__stage}>Interested</span>
              <IconArrowDownAlt svgClass={styles.tracker__svg} />
            </button>
            <button type="button" onClick={() => pillBtnClickHandler('qualified')} className={styles.tracker__pill}>
              <span className={styles.tracker__stage}>Qualified</span>
            </button>
            <button type="button" onClick={() => pillBtnClickHandler('negeotiation')} className={styles.tracker__pill}>
              <span className={styles.tracker__stage}>Negeotiation</span>
              <IconArrowDownAlt svgClass={styles.tracker__svg} />
            </button>
            <button type="button" onClick={() => pillBtnClickHandler('won')} className={styles.tracker__pill}>
              <span className={styles.tracker__stage}>Won</span>
              <IconArrowDownAlt svgClass={styles.tracker__svg} />
            </button>
          </div>
        </div>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default ContactLifecycle;
