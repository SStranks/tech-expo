import type { UUID } from '@apps/crm-shared';

export type CountryId = UUID & { readonly __companyId: 'CountryId' };
export type CountryClientId = UUID & { readonly __companyClientId: 'CountryClientId' };
