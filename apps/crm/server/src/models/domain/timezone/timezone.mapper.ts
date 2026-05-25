import type { UUID } from '@apps/crm-shared';

import type { TimezoneReadRow } from '#Models/query/timezone/timezone.types.js';

import type { TimeZoneDTO } from './timezone.dto.js';
import type { TimeZoneId } from './timezone.types.js';

export function asTimeZoneId(id: UUID): TimeZoneId {
  return id as TimeZoneId;
}

export function timeZoneReadRowToTimeZoneDTO(row: TimezoneReadRow): TimeZoneDTO {
  return {
    id: row.id,
    alpha2Code: row.alpha2Code,
    countryId: row.countryId,
    gmtOffset: row.gmtOffset,
  };
}
