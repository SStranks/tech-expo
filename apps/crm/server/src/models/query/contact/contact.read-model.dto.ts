import type { UUID } from '@apps/crm-shared';

import type { CompanyDTO } from '#Models/domain/company/company.dto.js';
import type { ContactStage } from '#Models/domain/contact/contact.types.js';

export type ContactOverviewDTO = {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  company: CompanyDTO;
  jobTitle: string;
  stage: ContactStage;
};
