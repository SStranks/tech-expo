import { PropsWithChildren } from 'react';
import styles from './_DefaultLayout.module.scss';

interface IProps {
  header: JSX.Element;
  aside: JSX.Element;
}

function DefaultLayout({ header, aside, children = undefined }: PropsWithChildren<IProps>): JSX.Element {
  return (
    <div className={styles.layout}>
      <div className={styles.layout__header}>{header}</div>
      <div className={styles.layout__contents}>
        {aside}
        <main>{children}</main>
      </div>
    </div>
  );
}

export default DefaultLayout;
