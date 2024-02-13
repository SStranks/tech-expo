import styles from './_DefaultLayout.module.scss';

interface IProps {
  header: JSX.Element;
  aside: JSX.Element;
  main: JSX.Element;
}

function DefaultLayout(props: IProps): JSX.Element {
  const { header, aside, main } = props;

  return (
    <div className={styles.layout}>
      <div className={styles.layout__header}>{header}</div>
      <div className={styles.layout__contents}>
        {aside}
        {main}
      </div>
    </div>
  );
}

export default DefaultLayout;
