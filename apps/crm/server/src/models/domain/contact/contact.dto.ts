import type { CompanyId } from '../company/company.types.js';
import type { TimeZoneId } from '../timezone/timezone.types.js';
import type { ContactId, ContactStage } from './contact.types.js';

export type ContactDTO = {
  id: ContactId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: CompanyId;
  jobTitle: string;
  stage: ContactStage;
  timezoneId: TimeZoneId | null;
  image: string | null;
};
