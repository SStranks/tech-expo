export const zErrorMessages = {
  UUID: `Invalid UUID`,
  DATETIME: (value: string) => `${value} is an invalid ISO Datetime`,
  EMPTY: (value: string) => `${value} cannot be empty`,
  ENUM: (value: string) => `Not valid value of ${value} enum`,
  FORMAT: (value: string) => `Invalid ${value} format`,
  STRING: (value: string) => `${value} must be a string`,
  URL: (value: string) => `${value} is an invalid URL string`,
};
