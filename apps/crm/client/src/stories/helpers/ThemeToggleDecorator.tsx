import type { Decorator } from '@storybook/react-webpack5';

import type { StorybookGlobals } from '../../../.storybook/preview';

import { useEffect, useRef } from 'react';
import { useGlobals } from 'storybook/internal/preview-api';

import { ThemeToggle } from './ThemeToggle';

import styles from './ThemeToggle.module.scss';

// override storybook/addons transition duration
const body = document.querySelector('body') ?? document.documentElement;
body.classList.add(styles['Storybook-ThemeToggle']);

const ThemeToggleDecorator: Decorator = (Story, context) => {
  const [globals, updateGlobals] = useGlobals();
  const { theme, themeBg } = globals as StorybookGlobals;
  const themeRef = useRef(theme);
  const themeBgRef = useRef(themeBg);

  useEffect(() => {
    // user switches light/dark theme toggle
    if (theme !== themeRef.current) {
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
    if (themeBg.light !== themeBgRef.current.light) body.style.setProperty('--thm-background-screen', themeBg.light);
    if (themeBg.dark !== themeBgRef.current.dark) body.style.setProperty('--thm-background-screen', themeBg.dark);

    themeBgRef.current = themeBg;
    return;
  }, [theme, themeBg]);

  return (
    <ThemeToggle themeBg={themeBg} updateGlobals={updateGlobals}>
      <Story {...context} />
    </ThemeToggle>
  );
};

export default ThemeToggleDecorator;
