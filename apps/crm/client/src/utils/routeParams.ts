import type { UUID } from '@apps/crm-shared';

export const parseUUID = (value: string | undefined): UUID => {
  if (!value) throw new Error('Missing UUID param');

  if (!/^[0-9a-f-]{36}$/i.test(value)) {
    throw new Error('Invalid UUID param');
  }

  return value as UUID;
};
