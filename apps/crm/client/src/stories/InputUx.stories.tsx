/* eslint-disable perfectionist/sort-objects */
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { expect } from 'storybook/test';

import { Input, InputUx } from '@Components/react-hook-form';
import { EMAIL_RULES } from '@Components/react-hook-form/validationRules';
import { WithFormProvider } from '@Stories/helpers/index';

const LABEL = 'Email Address';
const FIELDNAME = 'email';

const meta: Meta<typeof InputUx> = {
  title: 'Components/react-hook-form/InputUx',
  component: InputUx,
  decorators: [
    (Story) => {
      // NOTE: <div>: Component label requires parent background colour to 'inherit'
      return (
        <div style={{ backgroundColor: 'var(--thm-background-screen)', transition: 'background 1s' }}>
          <Story />
        </div>
      );
    },
    (Story) => {
      return (
        <WithFormProvider defaultValues={{ [FIELDNAME]: '' }} mode="onSubmit">
          <Story />
          <button type="submit" />
        </WithFormProvider>
      );
    },
  ],
};

export const InputUxStory: StoryObj = {
  args: {},
  globals: { backgrounds: { value: 'default' } },
  play: async ({ canvas, userEvent }) => {
    const emailInput = canvas.getByRole('textbox', { name: /email/i });
    const submitButton = canvas.getByRole('button');

    await userEvent.type(emailInput, 'example-email@email.com');
    await userEvent.click(submitButton);

    await expect(canvas.queryByRole('alert')).toBeNull();
  },
  render: () => {
    return (
      <InputUx label={LABEL} id="email" name={FIELDNAME} defaultValue="" rules={EMAIL_RULES}>
        <Input id="email" type="email" name={FIELDNAME} rules={EMAIL_RULES} autoComplete="email" />
      </InputUx>
    );
  },
};

export default meta;
