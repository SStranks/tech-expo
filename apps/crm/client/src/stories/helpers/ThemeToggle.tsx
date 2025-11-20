import type { Args, StoryContext } from '@storybook/react-webpack5';
import type { PropsWithChildren } from 'react';

import { MoonIcon, SunIcon } from '@storybook/icons';

import styles from './ThemeToggle.module.scss';

type IProps = {
  themeBg: { light: string; dark: string };
  updateGlobals: (newGlobals: Args) => void;
  context?: StoryContext;
};

export function ThemeToggle({ children, themeBg, updateGlobals }: PropsWithChildren<IProps>): React.JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.widgets}>
        <div className={styles.widgets__widget}>
          <SunIcon />
          <input
            type="color"
            value={themeBg.light || ''}
            onChange={(e) => updateGlobals({ themeBg: { ...themeBg, light: e.target.value } })}
          />
        </div>
        <div className={styles.widgets__widget}>
          <MoonIcon />
          <input
            type="color"
            value={themeBg.dark || ''}
            onChange={(e) => updateGlobals({ themeBg: { ...themeBg, dark: e.target.value } })}
          />
        </div>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}
