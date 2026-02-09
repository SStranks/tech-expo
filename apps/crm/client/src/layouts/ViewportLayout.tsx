import styles from './ViewportLayout.module.scss';

function ViewportLayout({ children }: { children?: React.ReactNode }): React.JSX.Element {
  return (
    <div className={styles.viewportLayout} data-testid="viewportLayout">
      {children}
    </div>
  );
}

export default ViewportLayout;
