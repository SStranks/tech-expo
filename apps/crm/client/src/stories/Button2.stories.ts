import type { Meta, StoryObj } from '@storybook/react-webpack5';

import ButtonDelete from '@Components/buttons/ButtonDelete';

// 👇 This default export determines where your story goes in the story list
const meta: Meta<typeof ButtonDelete> = {
  component: ButtonDelete,
};

export default meta;
type Story = StoryObj<typeof ButtonDelete>;

export const FirstStory: Story = {
  args: {
    disabled: false,
  },
};
