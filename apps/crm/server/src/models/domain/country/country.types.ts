import type { UUID } from '@apps/crm-shared';

export type CountryId = UUID & { readonly __companyId: unique symbol };
export type CountrySymbol = UUID & { readonly __companySymbol: unique symbol };
