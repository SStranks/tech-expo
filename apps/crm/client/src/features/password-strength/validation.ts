import type { ValidationRules } from '@Components/react-hook-form/validationRules';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';

export const PASSWORD_STRENGTH_RULES = {
  required: { message: VALIDATION_MESSAGES.PASSWORD_STRENGTH_RULES.required, value: true },
  validate: {
    strength: async (value: string) => {
      const { getStrength } = await import('@Lib/zxcvbn');
      const score = await getStrength(value);
      return score === 4 || VALIDATION_MESSAGES.PASSWORD_STRENGTH_RULES.validate.strength;
    },
  },
} satisfies ValidationRules;
