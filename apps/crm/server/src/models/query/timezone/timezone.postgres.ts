import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';

import type { TimezoneReadModel } from './timezone.read-model.js';
import type { TimezoneReadRow } from './timezone.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

export class PostgresTimezoneReadModel implements TimezoneReadModel {
  constructor() {}

  getTimezonesByIds(ids: TimeZoneId[]): Promise<TimezoneReadRow[]> {
    return postgresDBCall(async () => {
      const timezones = await postgresDB.query.TimeZoneTable.findMany({
        where: (timezone, { inArray }) => inArray(timezone.id, ids),
      });

      return timezones.map((tZ) => ({
        id: tZ.id,
        alpha2Code: tZ.alpha2Code,
        countryId: tZ.countryId,
        gmtOffset: tZ.gmtOffset,
      }));
    });
  }
}
