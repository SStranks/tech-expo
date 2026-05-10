import type { UUID } from '../types/api/base.js';

export const createMockUUID = (): UUID => crypto.randomUUID() as UUID;
export const toUUID = (value: string) => value as UUID;
