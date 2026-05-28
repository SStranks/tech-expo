import type { CompanyId } from '../company/company.types.js';
import type { TimeZoneId } from '../timezone/timezone.types.js';
import type { ContactId, ContactStage } from './contact.types.js';

export type ContactDTO = {
  id: ContactId;
  companyId: CompanyId;
  email: string;
  firstName: string;
  image: string | null;
  jobTitle: string;
  lastName: string;
  phone: string;
  stage: ContactStage;
  timezoneId: TimeZoneId | null;
};
