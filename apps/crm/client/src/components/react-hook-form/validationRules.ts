/* eslint-disable perfectionist/sort-objects */
import type { RegisterOptions } from 'react-hook-form';

export type TValidationRules = Pick<
  RegisterOptions,
  'required' | 'min' | 'max' | 'maxLength' | 'minLength' | 'pattern' | 'validate'
>;

export const GENERIC_TEXT_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid string',
  },
  minLength: {
    value: 1,
    message: 'Please enter a valid string',
  },
} satisfies TValidationRules;

export const GENERIC_NUMBER_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid number',
  },
  validate: {
    isNumber: (v: number) => !Number.isNaN(v) || 'Please enter a valid number',
  },
} satisfies TValidationRules;

export const EMAIL_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid email',
  },
  pattern: {
    value: /\S[^\s@]*@\S+\.\S+/,
    message: 'Entered value does not match email format',
  },
} satisfies TValidationRules;

export const PASSWORD_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid password',
  },
} satisfies TValidationRules;

export const PASSWORDCONFIRM_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid password',
  },
} satisfies TValidationRules;
