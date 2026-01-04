import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { CountriesTableInsert, CountriesTableSelect, CountriesTableUpdate } from '#Config/schema/Countries.js';

export interface CountryRepository {
  deleteById(id: UUID): Promise<CountriesTableSelect['id']>;
  deleteByIds(ids: UUID[]): Promise<CountriesTableSelect['id'][]>;
  findById(id: UUID): Promise<CountriesTableSelect | null>;
  findByIds(ids: UUID[]): Promise<CountriesTableSelect[]>;
  insert(company: CountriesTableInsert): Promise<CountriesTableSelect>;
  insertMany(companies: CountriesTableInsert[]): Promise<CountriesTableSelect[]>;
  updateById(id: UUID, company: CountriesTableUpdate): Promise<CountriesTableSelect>;
  updateByIds(ids: UUID[], companies: CountriesTableUpdate[]): Promise<CountriesTableSelect[]>;
}
