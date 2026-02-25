import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';

import type { TimezoneReadRow } from './timezone.types.js';

export interface TimezoneReadModel {
  getTimezonesByIds(ids: TimeZoneId[]): Promise<TimezoneReadRow[]>;
}
