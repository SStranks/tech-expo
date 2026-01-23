import type { UUID } from '@apps/crm-shared';

import type { ContactStage } from './contact.types.js';

export type ContactDTO = {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: UUID;
  jobTitle: string;
  stage: ContactStage;
  timezoneId: UUID | null;
  image: string | null;
};
