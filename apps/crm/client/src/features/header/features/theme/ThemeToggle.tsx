import { useCallback, useEffect } from 'react';

import IconTheme from '@Components/svg/IconTheme';
import { useReduxDispatch } from '@Redux/hooks';

import { toggleTheme } from './redux/themeSlice';

import styles from './ThemeToggle.module.scss';

export const LOCALSTORAGE_TOKEN = 'dark-mode';

function ThemeToggle(): React.JSX.Element {
  const reduxDispatch = useReduxDispatch();

  const themeToggle = useCallback(() => {
    const body = document.querySelector('body');
    body?.classList.add('theme-transition-duration');
    body?.classList.toggle('dark-theme');

    // Theme transition duration is added and immediately removed; prevents clash with :hover transitions
    requestAnimationFrame(() => {
      body?.classList.remove('theme-transition-duration');
    });

    // Set the localStorage key and set Redux state value
    if (body?.classList.contains('dark-theme')) {
      reduxDispatch(toggleTheme(true));
      globalThis.localStorage.setItem(LOCALSTORAGE_TOKEN, 'true');
    } else {
      reduxDispatch(toggleTheme(false));
      globalThis.localStorage.setItem(LOCALSTORAGE_TOKEN, 'false');
    }
  }, [reduxDispatch]);

  // Set theme on page load; check for localStorage token first, then user preferred color scheme
  useEffect(() => {
    const onPageLoad = () => {
      const localStorageToken = globalThis.localStorage.getItem(LOCALSTORAGE_TOKEN);
      if (localStorageToken !== null) {
        if (localStorageToken === 'true') return themeToggle();
        return;
      }
      const query = globalThis.matchMedia('(prefers-color-scheme: dark)');
      if (query.matches) {
        return themeToggle();
      }
    };

    window.addEventListener('load', onPageLoad);

    return () => window.removeEventListener('load', onPageLoad);
  }, [themeToggle]);

  return (
    <button type="button" className={styles.themeToggle} onClick={themeToggle} aria-label="theme switch toggle">
      <IconTheme svgClass={styles.themeToggle__svg} />
    </button>
  );
}
export default ThemeToggle;
