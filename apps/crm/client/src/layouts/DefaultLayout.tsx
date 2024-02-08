import Aside from '#Components/ui/Aside';
import Header from '#Components/ui/Header';
import Main from '#Components/ui/Main';
import styles from './_DefaultLayout.module.scss';

function DefaultLayout(): JSX.Element {
  return (
    <div className={styles.layout}>
      <div className={styles.layout__header}>
        <Header />
      </div>
      <div className={styles.layout__contents}>
        <Aside />
        <Main />
      </div>
    </div>
  );
}

export default DefaultLayout;
