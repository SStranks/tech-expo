import type { UUID } from '@apps/crm-shared';

import type { CountryReadRow } from './countries.read-model.types.js';

export interface CountryReadModel {
  findCountriesByIds(ids: UUID[]): Promise<CountryReadRow[]>;
}
