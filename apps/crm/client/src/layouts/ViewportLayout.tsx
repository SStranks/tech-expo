import { PropsWithChildren } from 'react';

import styles from './ViewportLayout.module.scss';

interface IProps {}

function ViewportLayout(props: PropsWithChildren<IProps>): JSX.Element {
  const { children } = props;
  return (
    <div className={styles.viewportLayout} data-testid="viewportLayout">
      {children}
    </div>
  );
}

export default ViewportLayout;
