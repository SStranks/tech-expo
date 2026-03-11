import type { UUID } from '@apps/crm-shared';

export type CountryId = UUID & { readonly __companyId: unique symbol };
export type CountryClientId = UUID & { readonly __companyClientId: unique symbol };
