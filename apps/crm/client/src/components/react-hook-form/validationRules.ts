export const EMAIL_RULES = {
  required: {
    value: true,
    message: 'Please enter a valid email',
  },
  pattern: {
    value: /\S+@\S+\.\S+/,
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
