import { UUID } from '@apps/crm-shared/src/types/api/base.js';

export function toDbUUID(id: UUID): `${string}-${string}-${string}-${string}-${string}` {
  return id as `${string}-${string}-${string}-${string}-${string}`;
}

export function toDbUUIDArray(ids: UUID[]): `${string}-${string}-${string}-${string}-${string}`[] {
  return ids as `${string}-${string}-${string}-${string}-${string}`[];
}
