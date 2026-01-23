import type { UUID } from '@apps/crm-shared';

import type { CompanyRoles } from './profile.types.js';

export type UserProfileDTO = {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  telephone: string | null;
  timezone: string | null;
  country: UUID;
  company: UUID;
  companyRole: CompanyRoles;
  image: string | null;
  updatedAt: Date;
};
