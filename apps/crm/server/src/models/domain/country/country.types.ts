import type { UUID } from '@apps/crm-shared';

export type CountryId = UUID & { readonly __countryId: 'CountryId' };
export type CountryClientGeneratedId = UUID & { readonly __countryClientGeneratedId: 'CountryClientGeneratedId' };
