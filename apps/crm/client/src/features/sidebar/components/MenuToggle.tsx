import styles from './_MenuToggle.module.scss';

interface IProps {
  sidebarMaximize: boolean | undefined;
  setSidebarMaximize: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

function MenuToggle(props: IProps): JSX.Element {
  const { sidebarMaximize, setSidebarMaximize } = props;

  const btnClickHandler = () => {
    setSidebarMaximize((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={btnClickHandler}
        className={styles.container__button}
        aria-label="side-menu collapse toggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21.5 21.5">
          <title>sidebar menu toggle</title>
          <path
            className={styles.container__svg}
            d="M10.69,0h.12a45.67,45.67,0,0,1,5.53.19,5.73,5.73,0,0,1,3.48,1.49,5.73,5.73,0,0,1,1.49,3.48,45.67,45.67,0,0,1,.19,5.53v.12a45.67,45.67,0,0,1-.19,5.53,5.73,5.73,0,0,1-1.49,3.48,5.73,5.73,0,0,1-3.48,1.49,45.67,45.67,0,0,1-5.53.19h-.12a45.67,45.67,0,0,1-5.53-.19,5.73,5.73,0,0,1-3.48-1.49A5.73,5.73,0,0,1,.19,16.34,45.67,45.67,0,0,1,0,10.81v-.12A45.67,45.67,0,0,1,.19,5.16,5.73,5.73,0,0,1,1.68,1.68,5.73,5.73,0,0,1,5.16.19,45.67,45.67,0,0,1,10.69,0ZM5.36,1.68A4.31,4.31,0,0,0,2.74,2.74,4.31,4.31,0,0,0,1.68,5.36a43.94,43.94,0,0,0-.18,5.39,43.94,43.94,0,0,0,.18,5.39,4.31,4.31,0,0,0,1.06,2.62,4.31,4.31,0,0,0,2.62,1.06,43.94,43.94,0,0,0,5.39.18,43.94,43.94,0,0,0,5.39-.18,4.31,4.31,0,0,0,2.62-1.06,4.31,4.31,0,0,0,1.06-2.62A43.94,43.94,0,0,0,20,10.75a43.94,43.94,0,0,0-.18-5.39,4.31,4.31,0,0,0-1.06-2.62,4.31,4.31,0,0,0-2.62-1.06,43.94,43.94,0,0,0-5.39-.18A43.94,43.94,0,0,0,5.36,1.68Z"
          />
          <path
            data-testid="path-1"
            className={`${styles.container__svg} ${sidebarMaximize ? styles['container__svg--reverse'] : ''}`}
            d="M14.78,7.22a.75.75,0,0,1,0,1.06l-2.47,2.47,2.47,2.47a.75.75,0,0,1-1.06,1.06l-3-3a.75.75,0,0,1,0-1.06l3-3A.75.75,0,0,1,14.78,7.22Z"
          />
          <path
            data-testid="path-2"
            className={`${styles.container__svg} ${sidebarMaximize ? styles['container__svg--reverse'] : ''}`}
            d="M10.78,7.22a.75.75,0,0,1,0,1.06L8.31,10.75l2.47,2.47a.75.75,0,0,1-1.06,1.06l-3-3a.75.75,0,0,1,0-1.06l3-3A.75.75,0,0,1,10.78,7.22Z"
          />
        </svg>
      </button>
    </div>
  );
}

export default MenuToggle;
