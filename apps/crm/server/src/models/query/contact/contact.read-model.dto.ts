import type { CompanyDTO } from '#Models/domain/company/company.dto.js';
import type { ContactId, ContactStage } from '#Models/domain/contact/contact.types.js';

export type ContactOverviewDTO = {
  id: ContactId;
  company: CompanyDTO;
  email: string;
  firstName: string;
  jobTitle: string;
  lastName: string;
  stage: ContactStage;
};
