/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { ContactReadModel } from './contacts.read-model.js';
import type { ContactQuery, ContactReadRow } from './contacts.read-model.types.js';

import { and, count, eq } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import ContactsTable from '#Config/schema/contacts/Contacts.js';
import { asCompanyId } from '#Models/domain/company/company.mapper.js';
import { asContactId } from '#Models/domain/contact/contact.mapper.js';
import { asTimeZoneId } from '#Models/domain/timezone/timezone.mapper.js';

export class PostgresContactReadModel implements ContactReadModel {
  constructor() {}

  async count(query?: ContactQuery): Promise<number> {
    return postgresDBCall(async () => {
      let sqlQuery = postgresDB.select({ count: count() }).from(ContactsTable).$dynamic();
      const whereConditions = [];

      if (query?.company) {
        whereConditions.push(eq(ContactsTable.company, query.company));
      }

      if (query?.stage) {
        whereConditions.push(eq(ContactsTable.stage, query.stage));
      }

      if (query?.timezone) {
        whereConditions.push(eq(ContactsTable.timezone, query.timezone));
      }

      if (whereConditions.length > 0) {
        sqlQuery = sqlQuery.where(and(...whereConditions));
      }

      const [result] = await sqlQuery;
      return result.count;
    });
  }

  async findContactsByIds(ids: UUID[]): Promise<ContactReadRow[]> {
    return postgresDBCall(async () => {
      const contacts = await postgresDB.query.ContactsTable.findMany({
        where: (contact, { inArray }) => inArray(contact.id, ids),
      });

      return contacts.map((c) => ({
        id: asContactId(c.id),
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        company: asCompanyId(c.company),
        jobTitle: c.jobTitle,
        stage: c.stage,
        timezone: c.timezone ? asTimeZoneId(c.timezone) : null,
        image: c.image,
      }));
    });
  }
}
