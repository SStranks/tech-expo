import type { UUID } from '@apps/crm-shared';

export type CountryReadRow = {
  id: UUID;
  numCode: number;
  alpha2Code: string;
  alpha3Code: string;
  shortName: string;
  nationality: string;
};
