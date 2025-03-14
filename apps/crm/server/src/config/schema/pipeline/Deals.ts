import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { CompaniesTable, ContactsTable, UserProfileTable } from '../index.js';

// ---------- ENUMS --------- //
export type TDealStage = (typeof DEAL_STAGE)[number];
export const DEAL_STAGE = ['new', 'follow-up', 'under review', 'won', 'lost', 'unassigned'] as const;
export const DealStageEnum = pgEnum('deal_stage', DEAL_STAGE);

// ---------- TABLES -------- //
export type TDealsTableInsert = InferInsertModel<typeof DealsTable>;
export type TDealsTableSelect = InferSelectModel<typeof DealsTable>;
export const DealsTable = pgTable('deals', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  serial: varchar({ length: 6 })
    .notNull()
    .$defaultFn(() => nanoid(6)),
  title: varchar('title', { length: 255 }),
  company: uuid('company_name')
    .references(() => CompaniesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  stage: DealStageEnum('deal_stage').notNull(),
  value: numeric('total_revenue', { precision: 14, scale: 2 }).default('0.00').notNull(),
  dealOwner: uuid('deal_owner')
    .references(() => UserProfileTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  dealContact: uuid('deal_contact')
    .references(() => ContactsTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const DealsTableRelations = relations(DealsTable, ({ one }) => {
  return {
    company: one(CompaniesTable, {
      fields: [DealsTable.company],
      references: [CompaniesTable.id],
    }),
    dealContact: one(ContactsTable, {
      fields: [DealsTable.dealContact],
      references: [ContactsTable.id],
    }),
    dealOwner: one(UserProfileTable, {
      fields: [DealsTable.dealOwner],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertDealsSchema = createInsertSchema(DealsTable);
export const selectDealsSchema = createSelectSchema(DealsTable);
export type TInsertDealsSchema = z.infer<typeof insertDealsSchema>;
export type TSelectDealsSchema = z.infer<typeof selectDealsSchema>;

export default DealsTable;
