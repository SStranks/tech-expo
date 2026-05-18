/* eslint-disable perfectionist/sort-objects */
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { expect } from 'storybook/test';

import InputPasswordStrength from '@Components/react-hook-form/input-password/InputPasswordStrength';

import { WithFormProvider } from './helpers/withFormProvider';

type Story = StoryObj<typeof meta>;

type InputPasswordStrengthArgs = typeof InputPasswordStrength;

const meta: Meta<InputPasswordStrengthArgs> = {
  title: 'Components/react-hook-form/InputPasswordStrength',
  component: InputPasswordStrength,
  args: {
    name: 'newPassword',
    label: 'Password',
    defaultValue: '',
    reveal: false,
  },
  argTypes: {
    name: { control: false },
    label: { control: 'text' },
    defaultValue: { control: 'text' },
    reveal: { control: 'boolean' },
  },
  decorators: [
    (Story) => {
      // NOTE: <div>: InputUX label requires parent background colour to 'inherit'
      return (
        <div style={{ backgroundColor: 'var(--thm-background-screen)', transition: 'background 1s' }}>
          <Story />
        </div>
      );
    },
    (Story, { args }) => {
      const { name, defaultValue } = args;
      return (
        <WithFormProvider
          key={String(defaultValue) + String(name)}
          defaultValues={{ [args.name]: args.defaultValue }}
          mode="onSubmit">
          <Story />
          <button type="submit" aria-label="submit form" />
        </WithFormProvider>
      );
    },
  ],
  globals: { backgrounds: { value: 'default' } },
  render: ({ ...args }) => {
    return <InputPasswordStrength {...args} />;
  },
};

export const Default: Story = {
  play: async ({ canvas, args, step }) => {
    const component = canvas.getByLabelText(args.label).parentElement;

    await step('InputUX exists in document', async () => {
      await expect(component).not.toBeNull();
      await expect(component).toBeInTheDocument();
    });
  },
};

export default meta;
