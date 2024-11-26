import { PropsWithChildren } from 'react';

import styles from './DefaultLayout.module.scss';

interface IProps {
  header: JSX.Element;
  aside: JSX.Element;
}

function DefaultLayout({ aside, children = undefined, header }: PropsWithChildren<IProps>): JSX.Element {
  return (
    <div className={styles.layout}>
      <div className={styles.layout__header}>{header}</div>
      <div className={styles.layout__contents}>
        {aside}
        <main className={styles.layout__main}>{children}</main>
      </div>
    </div>
  );
}

export default DefaultLayout;
