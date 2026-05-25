import type { CompanyDTO } from '#Models/domain/company/company.dto.js';
import type { ContactId, ContactStage } from '#Models/domain/contact/contact.types.js';

export type ContactOverviewDTO = {
  id: ContactId;
  firstName: string;
  lastName: string;
  email: string;
  company: CompanyDTO;
  jobTitle: string;
  stage: ContactStage;
};
