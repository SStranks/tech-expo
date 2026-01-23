import type { UUID } from '@apps/crm-shared';

export type ContactStage = (typeof CONTACT_STAGE)[number];
export const CONTACT_STAGE = [
  'NEW',
  'CONTACTED',
  'INTERESTED',
  'UNQUALIFIED',
  'QUALIFIED',
  'NEGOTIATION',
  'LOST',
  'WON',
  'CHURNED',
] as const;

export type ContactId = UUID & { readonly __contactId: unique symbol };
