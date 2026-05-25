import type { UUID } from '@apps/crm-shared';

export type CompanyNoteId = UUID & { readonly __companyNoteId: 'CompanyNoteId' };

export type CompanyNoteClientGeneratedId = UUID & {
  readonly __companyNoteClientGeneratedId: 'CompanyNoteClientGeneratedId';
};
