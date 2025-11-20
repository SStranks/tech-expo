import { useEffect, useRef } from 'react';
import { useGlobals } from 'storybook/internal/preview-api';

import { ThemeToggle } from './ThemeToggle';

import styles from './ThemeToggle.module.scss';

// override storybook/addons transition duration
const body = (document.querySelector('body') ?? document.documentElement) as HTMLElement;
body?.classList.add(styles['Storybook-ThemeToggle']);

const ThemeToggleDecorator = (Story: any, context: any) => {
  const [{ theme, themeBg }, updateGlobals] = useGlobals();
  const themeRef = useRef(theme);
  const themeBgRef = useRef(themeBg);

  useEffect(() => {
    // user switches light/dark theme toggle
    if (theme !== themeRef) {
      if (theme === 'light') {
        body.classList.remove('dark-theme');
        body.style.setProperty('--thm-background-screen', themeBg.light);
      }
      if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.style.setProperty('--thm-background-screen', themeBg.dark);
      }

      themeRef.current = theme;
      return;
    }

    // user adjusts light/dark theme colour value
    if (themeBg !== themeBgRef) {
      if (themeBg.light !== themeBgRef.current.light) body.style.setProperty('--thm-background-screen', themeBg.light);
      if (themeBg.dark !== themeBgRef.current.dark) body.style.setProperty('--thm-background-screen', themeBg.dark);

      themeBgRef.current = themeBgRef;
      return;
    }
  }, [theme, themeBg]);

  return (
    <ThemeToggle themeBg={themeBg} updateGlobals={updateGlobals}>
      <Story {...context} />
    </ThemeToggle>
  );
};

export default ThemeToggleDecorator;
