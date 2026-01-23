import type { UUID } from '@apps/crm-shared';

export type UserId = UUID & { readonly __userId: unique symbol };
