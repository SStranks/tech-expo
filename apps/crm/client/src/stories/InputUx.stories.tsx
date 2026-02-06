/* eslint-disable perfectionist/sort-objects */
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { expect } from 'storybook/test';

import Input from '@Components/react-hook-form/input/Input';
import InputUx from '@Components/react-hook-form/InputUx';
import { EMAIL_RULES } from '@Components/react-hook-form/validationRules';

import { WithFormProvider } from './helpers/withFormProvider';

interface InputUxStoryArgs extends React.ComponentProps<typeof InputUx> {
  childrenArgs: React.ComponentProps<typeof Input>;
}

type Story = StoryObj<typeof meta>;

const meta: Meta<InputUxStoryArgs> = {
  title: 'Components/react-hook-form/InputUx',
  component: InputUx,
  args: {
    id: 'email',
    name: 'email',
    label: 'Email Address',
    defaultValue: '',
    disabled: false,
    rules: EMAIL_RULES,
    childrenArgs: {
      id: 'email',
      name: 'email',
      type: 'email',
      rules: EMAIL_RULES,
      autoComplete: 'email',
    },
  },
  argTypes: {
    id: { control: false },
    name: { control: false },
    label: { control: 'text' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    rules: { control: false },
    childrenArgs: { control: false },
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
  render: ({ childrenArgs, ...args }) => {
    return (
      <InputUx {...args}>
        <Input {...childrenArgs} />
      </InputUx>
    );
  },
};

export const Default: Story = {
  play: async ({ canvas, args, step }) => {
    const emailInput = canvas.getByRole('textbox', { name: /email/i });
    const uxWrapper = canvas.getByLabelText(args.label).parentElement;

    await step('InputUX exists in document', async () => {
      await expect(uxWrapper).not.toBeNull();
      await expect(uxWrapper).toBeInTheDocument();
    });

    await step('InputUX has no focus', async () => {
      await expect(emailInput).not.toHaveFocus();
      await expect(emailInput).toHaveTextContent('');
    });

    await step('InputUX has no error state', async () => {
      await expect(canvas.queryByRole('alert')).toBeNull();
      await expect(uxWrapper).not.toHaveClass(/error/i);
    });

    await step('InputUX has no success state', async () => {
      await expect(uxWrapper).not.toHaveClass(/success/i);
    });
  },
};

export const DefaultValue: Story = {
  args: { defaultValue: 'AdamSmith99@gmail.com' },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent, args, step }) => {
    const uxWrapper = canvas.getByLabelText(args.label).parentElement;

    await step('Element should have pointer-events set to none', async () => {
      await expect(uxWrapper).not.toBeNull();
      await expect(getComputedStyle(uxWrapper!).pointerEvents).toBe('none');
    });

    await step('Element should not receive tab focus', async () => {
      await userEvent.tab();
      await expect(uxWrapper!.contains(document.activeElement)).toBe(false);
    });

    await step('Element should be inert; children removed from navigation tree', async () => {
      await expect(uxWrapper).toHaveAttribute('inert');
    });
  },
};

export const ErrorRequiredInput: Story = {
  name: 'Error: Required Input',
  play: async ({ canvas, userEvent, args, step }) => {
    const submitButton = canvas.getByRole('button');
    const uxWrapper = canvas.getByLabelText(args.label).parentElement;

    await step('InputUX should have alert element with required error message', async () => {
      await userEvent.click(submitButton);
      await expect(canvas.queryByRole('alert')).toHaveTextContent(EMAIL_RULES.required.message);
      await expect(uxWrapper).toHaveClass(/error/i);
    });

    await step('InputUX should error state', async () => {
      await expect(uxWrapper).toHaveClass(/error/i);
    });
  },
};

export const ErrorInvalidPattern: Story = {
  name: 'Error: Invalid Pattern',
  play: async ({ canvas, userEvent, args, step }) => {
    const emailInput = canvas.getByRole('textbox', { name: /email/i });
    const submitButton = canvas.getByRole('button');
    const uxWrapper = canvas.getByLabelText(args.label).parentElement;

    await step('Enter partial email address', async () => {
      await userEvent.type(emailInput, 'example-email@g');
    });

    await step('InputUX should have alert element with pattern error message', async () => {
      await userEvent.click(submitButton);
      await expect(canvas.queryByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern.message);
    });

    await step('InputUX should error state', async () => {
      await expect(uxWrapper).toHaveClass(/error/i);
    });
  },
};

export const ErrorToSucess: Story = {
  name: 'Resolve: Error to Success',
  play: async ({ canvas, userEvent, args, step }) => {
    const emailInput = canvas.getByRole('textbox', { name: /email/i });
    const submitButton = canvas.getByRole('button');
    const uxWrapper = canvas.getByLabelText(args.label).parentElement;

    await step('Enter partial email address and Submit Form', async () => {
      await userEvent.type(emailInput, 'example-email@g');
      await userEvent.click(submitButton);
      await expect(canvas.queryByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern.message);
    });

    await step('InputUX should have success state, after finishing typing valid email address', async () => {
      await userEvent.type(emailInput, 'mail.com');
      await userEvent.click(submitButton);
      await expect(canvas.queryByRole('alert')).toBeNull();
      await expect(uxWrapper).toHaveClass(/success/i);
    });
  },
};

export const SuccessState: Story = {
  play: async ({ canvas, userEvent, args, step }) => {
    const emailInput = canvas.getByRole('textbox', { name: /email/i });
    const submitButton = canvas.getByRole('button');
    const uxWrapper = canvas.getByLabelText(args.label).parentElement;

    await step('Enter valid email address', async () => {
      await userEvent.type(emailInput, 'example-email@email.com');
    });

    await step('InputUX should have success state on form submission', async () => {
      await userEvent.click(submitButton);
      await expect(canvas.queryByRole('alert')).toBeNull();
      await expect(uxWrapper).toHaveClass(/success/i);
    });
  },
};

export const FocusedState: Story = {
  name: 'Focused Input',
  play: async ({ canvas, userEvent, step }) => {
    const emailInput = canvas.getByRole('textbox', { name: /email/i });

    await step('InputUX should have click focus', async () => {
      await userEvent.click(emailInput);
      await expect(emailInput).toHaveFocus();
    });
  },
};

export const A11yTest: Story = {
  name: 'Accessible Name',
  args: {
    label: 'Email Address',
  },
  play: async ({ canvas, step, args }) => {
    await step('Check for label association', async () => {
      const emailInput = canvas.getByRole('textbox', { name: /email/i });
      await expect(emailInput).toHaveAccessibleName(args.label);
    });
  },
};

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
};

export default meta;
