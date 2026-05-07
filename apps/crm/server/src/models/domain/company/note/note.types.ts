import type { UUID } from '@apps/crm-shared';

export type CompanyNoteId = UUID & { readonly __companyNoteId: 'CompanyNoteId' };

export type CompanyNoteClientId = UUID & { readonly __companyNoteClientId: 'CompanyNoteClientId' };
