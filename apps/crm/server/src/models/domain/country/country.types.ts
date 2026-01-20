import type { UUID } from '@apps/crm-shared';

export type CountryId = UUID & { readonly __companyId: unique symbol };
