import type { UUID } from '@apps/crm-shared';

import type { BusinessType, CompanySize } from './company.types.js';
import type { CompanyNoteDTO } from './note/note.dto.js';

export type CompanyDTO = {
  id: UUID;
  name: string;
  size: CompanySize;
  totalRevenue: string;
  industry: string;
  businessType: BusinessType;
  country: UUID;
  website: string | null;
  notes?: CompanyNoteDTO[];
};
