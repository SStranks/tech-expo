import type { PropsWithChildren } from 'react';

import styles from './ViewportLayout.module.scss';

type Props = {};

function ViewportLayout(props: PropsWithChildren<Props>): React.JSX.Element {
  const { children } = props;
  return (
    <div className={styles.viewportLayout} data-testid="viewportLayout">
      {children}
    </div>
  );
}

export default ViewportLayout;
