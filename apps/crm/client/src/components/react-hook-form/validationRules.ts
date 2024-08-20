export const GENERIC_TEXT_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid string',
  },
  minLength: {
    value: 1,
    message: 'Please enter a valid string',
  },
};

export const GENERIC_NUMBER_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid number',
  },
  validate: {
    isNumber: (v: number) => !Number.isNaN(v) || 'Please enter a valid number',
  },
};

export const EMAIL_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid email',
  },
  pattern: {
    value: /\S[^\s@]*@\S+\.\S+/,
    message: 'Entered value does not match email format',
  },
};

export const PASSWORD_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid password',
  },
};

export const PASSWORDCONFIRM_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid password',
  },
};
