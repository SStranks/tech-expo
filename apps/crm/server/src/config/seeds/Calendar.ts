import type { TPostgresDB } from '#Config/dbPostgres';

import { sql } from 'drizzle-orm';
import { seed } from 'drizzle-seed';

import { CalendarTable, CompaniesTable } from '#Config/schema';

export default async function seedCalendar(db: TPostgresDB) {
  const ENTRY_COUNT = 5;

  const companyIds = await db
    .select({ id: CompaniesTable.id })
    .from(CompaniesTable)
    .orderBy(sql`random()`)
    .limit(ENTRY_COUNT);

  if (companyIds.length !== ENTRY_COUNT)
    throw new Error(`Error: Could not source ${ENTRY_COUNT} companies from company table`);

  const values = companyIds.map(({ id }) => id);

  await seed(db, { CalendarTable }, { seed: 1, version: '2' }).refine((f) => ({
    CalendarTable: {
      count: ENTRY_COUNT,
      columns: {
        createdAt: f.default({ defaultValue: undefined }),
        companyId: f.valuesFromArray({
          isUnique: true,
          values,
        }),
      },
    },
  }));

  console.log('Seed Successful: Calendar.ts');
}
