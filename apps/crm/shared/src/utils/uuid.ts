import type { UUID } from '../types/api/base.js';

import { randomUUID } from 'node:crypto';

export const createMockUUID = (): UUID => randomUUID() as UUID;
export const toUUID = (value: string) => value as UUID;
