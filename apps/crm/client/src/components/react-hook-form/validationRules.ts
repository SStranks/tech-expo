/* eslint-disable perfectionist/sort-objects */
import type { RegisterOptions } from 'react-hook-form';

import { getStrength } from '@Lib/zxcvbn';

export const VALIDATION_MESSAGES = {
  GENERIC_TEXT_RULES: {
    required: 'Please enter a valid string',
    minLength: 'Please enter a valid string',
  },
  GENERIC_NUMBER_RULES: {
    required: 'Please enter a valid number',
    validate: { isNumber: 'Please enter a valid number' },
  },
  EMAIL_RULES: { required: 'Please enter a valid email', pattern: 'Entered value does not match email format' },
  PASSWORD_RULES: { required: 'Please enter a valid password' },
  PASSWORD_STRENGTH_RULES: {
    required: 'Please enter strong password',
    validate: { strength: 'Password is insufficiently strong' },
  },
  PASSWORDCONFIRM_RULES: {
    required: 'Please enter your new password',
    validate: { confirm: 'Passwords must be identical' },
  },
};

export type ValidationRules = Pick<
  RegisterOptions,
  'required' | 'min' | 'max' | 'maxLength' | 'minLength' | 'pattern' | 'validate'
>;

export const GENERIC_TEXT_RULES = {
  required: {
    value: true,
    message: VALIDATION_MESSAGES.GENERIC_TEXT_RULES.required,
  },
  minLength: {
    value: 1,
    message: VALIDATION_MESSAGES.GENERIC_TEXT_RULES.minLength,
  },
} satisfies ValidationRules;

export const GENERIC_NUMBER_RULES = {
  required: {
    value: true,
    message: VALIDATION_MESSAGES.GENERIC_NUMBER_RULES.required,
  },
  validate: {
    isNumber: (v: number) => !Number.isNaN(v) || VALIDATION_MESSAGES.GENERIC_NUMBER_RULES.validate.isNumber,
  },
} satisfies ValidationRules;

export const EMAIL_RULES = {
  required: {
    value: true,
    message: VALIDATION_MESSAGES.EMAIL_RULES.required,
  },
  pattern: {
    value: /\S[^\s@]*@\S+\.\S+/,
    message: VALIDATION_MESSAGES.EMAIL_RULES.pattern,
  },
} satisfies ValidationRules;

export const PASSWORD_RULES = {
  required: {
    value: true,
    message: VALIDATION_MESSAGES.PASSWORD_RULES.required,
  },
} satisfies ValidationRules;

export const PASSWORD_STRENGTH_RULES = {
  required: { message: VALIDATION_MESSAGES.PASSWORD_STRENGTH_RULES.required, value: true },
  validate: {
    strength: async (value: string) => {
      const score = await getStrength(value);
      return score === 4 || VALIDATION_MESSAGES.PASSWORD_STRENGTH_RULES.validate.strength;
    },
  },
} satisfies ValidationRules;

export const PASSWORDCONFIRM_RULES = {
  required: {
    value: true,
    message: VALIDATION_MESSAGES.PASSWORDCONFIRM_RULES.required,
  },
} satisfies ValidationRules;
