import type { Decorator } from '@storybook/react-webpack5';

import type { StorybookGlobals } from '../preview';

import { useEffect } from 'react';
import { useGlobals } from 'storybook/internal/preview-api';

import { ThemeToggle } from './ThemeToggle';

import styles from './ThemeToggle.module.scss';

// override storybook/addons transition duration
const body = document.querySelector('body') ?? document.documentElement;
body.classList.add(styles['Storybook-ThemeToggle']);

const ThemeToggleDecorator: Decorator = (Story, context) => {
  const [globals, updateGlobals] = useGlobals();
  const { theme, themeBg } = globals as StorybookGlobals;

  useEffect(() => {
    // user switches light/dark theme toggle

    if (theme === 'light') {
      body.classList.remove('dark-theme');
      body.style.setProperty('--thm-background-screen', themeBg.light);
    }
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.style.setProperty('--thm-background-screen', themeBg.dark);
    }
  }, [theme, themeBg]);

  useEffect(() => {
    // user adjusts light/dark theme colour value
    body.style.setProperty('--thm-background-screen', theme === 'dark' ? themeBg.dark : themeBg.light);
  }, [theme, themeBg]);

  return (
    <ThemeToggle themeBg={themeBg} updateGlobals={updateGlobals}>
      <Story {...context} />
    </ThemeToggle>
  );
};

export default ThemeToggleDecorator;
