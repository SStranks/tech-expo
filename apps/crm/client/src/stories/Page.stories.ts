/* eslint-disable perfectionist/sort-objects */
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { expect, userEvent, within } from 'storybook/test';

import { Page } from './Page';

const meta = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton); // TEST:  Eslint-storybook - should error without await keyword; known bug: https://github.com/storybookjs/eslint-plugin-storybook/issues/168
    await expect(loginButton).not.toBeInTheDocument();

    const logoutButton = canvas.getByRole('button', { name: /log out/i });
    await expect(logoutButton).toBeInTheDocument();
  },
};
