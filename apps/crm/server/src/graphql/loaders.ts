import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { CountryDTO } from '#Models/country/Country.js';
import type { CountryService } from '#Services/Country.js';

import DataLoader from 'dataloader';

export type CountryDataLoader = DataLoader<string, CountryDTO | null>;
export const createCountryLoader = (countryService: CountryService) =>
  new DataLoader<UUID, CountryDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const countries = await countryService.getCountriesById(uniqueIds);
    const countryMap = new Map(countries.map((c) => [c.id, c]));

    return ids.map((id) => countryMap.get(id) ?? null);
  });
