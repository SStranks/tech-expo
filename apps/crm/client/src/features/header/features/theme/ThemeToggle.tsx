import { IconTheme } from '#Components/svg';
import styles from './_ThemeToggle.module.scss';

const themeToggle = () => {
  const body = document.querySelector('body');
  body?.classList.toggle('dark-theme');
};

function ThemeToggle(): JSX.Element {
  return (
    <button type="button" className={styles.themeToggle} onClick={themeToggle} aria-label="theme switch toggle">
      <IconTheme svgClass={styles.themeToggle__svg} />
    </button>
  );
}
export default ThemeToggle;
