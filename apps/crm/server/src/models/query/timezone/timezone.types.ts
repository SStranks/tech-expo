import type { UUID } from '@apps/crm-shared';

export type TimezoneReadRow = {
  id: UUID;
  alpha2Code: string;
  gmtOffset: string;
  countryId: UUID;
};
