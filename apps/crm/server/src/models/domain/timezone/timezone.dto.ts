import type { UUID } from '@apps/crm-shared';

export type TimeZoneDTO = {
  id: UUID;
  alpha2Code: string;
  gmtOffset: string;
  countryId: UUID;
};
