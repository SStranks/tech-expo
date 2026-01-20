/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CountriesTableSelect } from '#Config/schema/Countries.js';
import type { CountryReadRow } from '#Models/query/country/countries.read-model.types.js';

import type { CountryDTO } from './country.dto.js';
import type { PersistedCountry } from './country.js';
import type { CountryId } from './country.types.js';

import { Country } from './country.js';

export function asCountryId(id: UUID): CountryId {
  return id as CountryId;
}

export function countryReadRowToDTO(country: CountryReadRow): CountryDTO {
  return {
    id: country.id,
    alpha2Code: country.alpha2Code,
    alpha3Code: country.alpha3Code,
    nationality: country.nationality,
    numCode: country.numCode,
    shortName: country.shortName,
  };
}

export function countryDomainToCountryDTO(country: PersistedCountry): CountryDTO {
  return {
    id: country.id,
    alpha2Code: country.alpha2Code,
    alpha3Code: country.alpha3Code,
    nationality: country.nationality,
    numCode: country.numCode,
    shortName: country.shortName,
  };
}

export function toCountryDomain(row: CountriesTableSelect): PersistedCountry {
  return Country.rehydrate({
    id: asCountryId(row.id),
    numCode: row.numCode,
    alpha2Code: row.alpha2Code,
    alpha3Code: row.alpha3Code,
    shortName: row.shortName,
    nationality: row.nationality,
  });
}
