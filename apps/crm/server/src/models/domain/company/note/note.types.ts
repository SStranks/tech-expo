import type { UUID } from '@apps/crm-shared';

export type CompanyNoteId = UUID & { readonly __companyNoteId: unique symbol };

export type CompanyNoteSymbol = UUID & { readonly __companyNoteSymbol: unique symbol };
