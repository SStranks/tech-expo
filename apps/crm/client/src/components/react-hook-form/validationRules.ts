import type { RegisterOptions } from 'react-hook-form';

export const VALIDATION_MESSAGES = {
  EMAIL_RULES: { pattern: 'Entered value does not match email format', required: 'Please enter a valid email' },
  GENERIC_NUMBER_RULES: {
    required: 'Please enter a valid number',
    validate: { isNumber: 'Please enter a valid number' },
  },
  GENERIC_TEXT_RULES: {
    minLength: 'Please enter a valid string',
    required: 'Please enter a valid string',
  },
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
  minLength: {
    message: VALIDATION_MESSAGES.GENERIC_TEXT_RULES.minLength,
    value: 1,
  },
  required: {
    message: VALIDATION_MESSAGES.GENERIC_TEXT_RULES.required,
    value: true,
  },
} satisfies ValidationRules;

export const GENERIC_NUMBER_RULES = {
  required: {
    message: VALIDATION_MESSAGES.GENERIC_NUMBER_RULES.required,
    value: true,
  },
  validate: {
    isNumber: (v: number) => !Number.isNaN(v) || VALIDATION_MESSAGES.GENERIC_NUMBER_RULES.validate.isNumber,
  },
} satisfies ValidationRules;

export const EMAIL_RULES = {
  pattern: {
    message: VALIDATION_MESSAGES.EMAIL_RULES.pattern,
    value: /\S[^\s@]*@\S+\.\S+/,
  },
  required: {
    message: VALIDATION_MESSAGES.EMAIL_RULES.required,
    value: true,
  },
} satisfies ValidationRules;

export const PASSWORD_RULES = {
  required: {
    message: VALIDATION_MESSAGES.PASSWORD_RULES.required,
    value: true,
  },
} satisfies ValidationRules;

export const PASSWORDCONFIRM_RULES = {
  required: {
    message: VALIDATION_MESSAGES.PASSWORDCONFIRM_RULES.required,
    value: true,
  },
} satisfies ValidationRules;
