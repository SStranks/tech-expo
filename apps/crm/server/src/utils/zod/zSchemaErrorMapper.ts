export const zErrorMessages = {
  UUID: `Invalid UUID`,
  EMPTY: (value: string) => `${value} cannot be empty`,
  FORMAT: (value: string) => `Invalid ${value} format`,
  STRING: (value: string) => `${value} must be a string`,
  URL: (value: string) => `${value} is an invalid URL string`,
};
