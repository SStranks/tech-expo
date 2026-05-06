import type { UUID } from '@apps/crm-shared';

import { randomUUID } from 'node:crypto';

export const createMockUUID = (): UUID => randomUUID() as UUID;
