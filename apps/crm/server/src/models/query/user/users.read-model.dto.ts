import type { UUID } from '@apps/crm-shared';

export type UserAvatarReadDTO = {
  id: UUID;
  firstName: string;
  lastName: string;
  image: string | null;
};
