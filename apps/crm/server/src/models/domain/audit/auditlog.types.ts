import type { UUID } from '@apps/crm-shared';

export type EntityAction = (typeof ENTITY_ACTION)[number];
export const ENTITY_ACTION = ['INSERT', 'UPDATE', 'DELETE'] as const;

export type AuditId = UUID & { readonly __auditId: unique symbol };
