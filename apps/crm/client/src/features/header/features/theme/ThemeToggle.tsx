import { useEffect } from 'react';
import { IconTheme } from '#Components/svg';
import styles from './_ThemeToggle.module.scss';

const LOCALSTORAGE_TOKEN = 'dark-mode';

const themePreferenceLocalStorage = (body: HTMLElement | null) => {
  if (body?.classList.contains('dark-theme')) {
    window.localStorage.setItem(LOCALSTORAGE_TOKEN, 'true');
  } else {
    window.localStorage.setItem(LOCALSTORAGE_TOKEN, 'false');
  }
};

const themeToggle = () => {
  const body = document.querySelector('body');
  body?.classList.toggle('dark-theme');
  themePreferenceLocalStorage(body);
};

function ThemeToggle(): JSX.Element {
  // Set theme on page load; check for localStorage token first, then user preferred color scheme
  useEffect(() => {
    const onPageLoad = () => {
      const localStorageToken = window.localStorage.getItem(LOCALSTORAGE_TOKEN);
      if (localStorageToken === 'true') {
        return themeToggle();
      }
      const query = window.matchMedia('(prefers-color-scheme: dark)');
      if (query.matches) {
        return themeToggle();
      }
    };

    window.addEventListener('load', onPageLoad);

    return () => window.removeEventListener('load', onPageLoad);
  }, []);

  return (
    <button type="button" className={styles.themeToggle} onClick={themeToggle} aria-label="theme switch toggle">
      <IconTheme svgClass={styles.themeToggle__svg} />
    </button>
  );
}
export default ThemeToggle;
