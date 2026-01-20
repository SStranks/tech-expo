import type { UUID } from '@apps/crm-shared';

import type { TimeZoneId } from './timezone.types.js';

export function asTimeZoneId(id: UUID): TimeZoneId {
  return id as TimeZoneId;
}
