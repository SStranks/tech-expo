import { IconSidebarToggle } from '#Svg/icons';
import styles from './_MenuToggle.module.scss';

interface IProps {
  sidebarMaximize: boolean;
  setSidebarMaximize: React.Dispatch<React.SetStateAction<boolean>>;
}

function MenuToggle(props: IProps): JSX.Element {
  const { sidebarMaximize, setSidebarMaximize } = props;

  const btnClickHandler = () => {
    setSidebarMaximize((prev) => !prev);
  };

  return (
    <div className={styles.container} aria-label="side-menu collapse toggle">
      <button
        type="button"
        onClick={btnClickHandler}
        className={sidebarMaximize ? styles.container__button : styles['container__button--reverse']}>
        <img src={IconSidebarToggle} alt="" />
      </button>
    </div>
  );
}

export default MenuToggle;
