import type { UUID } from 'node:crypto';

import type { TCountryDTO } from '#Models/country/Country.js';
import type { TCountryService } from '#Services/Country.js';

import DataLoader from 'dataloader';

export type TCountryDataLoader = DataLoader<string, TCountryDTO | null>;
export const createCountryLoader = (countryService: TCountryService) =>
  new DataLoader<UUID, TCountryDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const countries = await countryService.getCountriesById(uniqueIds);
    const countryMap = new Map(countries.map((c) => [c.id, c]));

    return ids.map((id) => countryMap.get(id) ?? null);
  });
