/* eslint-disable perfectionist/sort-objects */
import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';
import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { PersistedContactNote } from '#Models/domain/contact/note/note.js';
import type { ContactNoteId } from '#Models/domain/contact/note/note.types.js';

import type { ContactReadModel } from './contacts.read-model.js';
import type {
  ContactNoteReadRow,
  ContactQuery,
  ContactReadRow,
  ContactsOverviewPaginated,
  ContactsOverviewQuery,
} from './contacts.read-model.types.js';

import { and, asc, count, desc, eq, ilike, or, sql } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import CompaniesTable from '#Config/schema/companies/Companies.js';
import ContactsTable from '#Config/schema/contacts/Contacts.js';
import { SortDirection } from '#Graphql/generated/graphql.gen.js';
import { contactNoteRowToDomain } from '#Models/domain/contact/note/note.mapper.js';

import { contactWithRelationsToOverviewRow } from './contact.read-model.mapper.js';

const contactSortFieldMap = {
  STATUS: ContactsTable.stage,
};

export type ContactWithRelations = {
  company: CompaniesTableSelect;
  contact: ContactsTableSelect;
};

export class PostgresContactReadModel implements ContactReadModel {
  constructor() {}

  async count(query?: ContactQuery): Promise<number> {
    return postgresDBCall(async () => {
      let sqlQuery = postgresDB.select({ count: count() }).from(ContactsTable).$dynamic();
      const whereConditions = [];

      if (query?.companyId) {
        whereConditions.push(eq(ContactsTable.companyId, query.companyId));
      }

      if (query?.stage) {
        whereConditions.push(eq(ContactsTable.stage, query.stage));
      }

      if (query?.timezoneId) {
        whereConditions.push(eq(ContactsTable.timezoneId, query.timezoneId));
      }

      if (whereConditions.length > 0) {
        sqlQuery = sqlQuery.where(and(...whereConditions));
      }

      const [row] = await sqlQuery;
      return row?.count ?? 0;
    });
  }

  async findContactsByIds(ids: ContactId[]): Promise<ContactReadRow[]> {
    return postgresDBCall(async () => {
      const contacts = await postgresDB.query.ContactsTable.findMany({
        where: (contact, { inArray }) => inArray(contact.id, ids),
      });

      return contacts.map((c) => ({
        id: c.id,
        clientGeneratedId: c.clientGeneratedId,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        companyId: c.companyId,
        jobTitle: c.jobTitle,
        stage: c.stage,
        timezoneId: c.timezoneId ?? null,
        image: c.image,
      }));
    });
  }

  async findContactNoteByContactNoteId(id: ContactNoteId): Promise<PersistedContactNote | null> {
    return postgresDBCall(async () => {
      const contactNote = await postgresDB.query.ContactsNotesTable.findFirst({
        where: (contactNote, { eq }) => eq(contactNote.id, id),
      });

      return contactNote ? contactNoteRowToDomain(contactNote) : null;
    });
  }

  async findContactNotesByContactId(id: ContactId): Promise<ContactNoteReadRow[]> {
    return postgresDBCall(async () => {
      const contactNotes = await postgresDB.query.ContactsNotesTable.findMany({
        where: (contactNote, { eq }) => eq(contactNote.contactId, id),
      });

      return contactNotes.map((cN) => ({
        id: cN.id,
        clientGeneratedId: cN.clientGeneratedId,
        note: cN.note,
        contactId: cN.contactId,
        createdAt: cN.createdAt,
        createdByUserProfileId: cN.createdByUserProfileId,
      }));
    });
  }

  async findContactOverview(query: ContactsOverviewQuery): Promise<ContactsOverviewPaginated> {
    return postgresDBCall(async () => {
      let sqlQuery = postgresDB
        .select({
          contact: ContactsTable,
          company: CompaniesTable,
          totalCount: sql<number>`COUNT(*) OVER()`,
        })
        .from(ContactsTable)
        .innerJoin(CompaniesTable, eq(ContactsTable.companyId, CompaniesTable.id))
        .$dynamic();
      const whereConditions = [];
      const orderClauses = [];

      if (query.filters.searchContactName) {
        const parts = query.filters.searchContactName.trim().split(' ');

        if (parts.length === 2) {
          whereConditions.push(
            and(ilike(ContactsTable.firstName, `%${parts[0]}%`), ilike(ContactsTable.lastName, `%${parts[1]}%`))
          );
        } else {
          whereConditions.push(
            or(ilike(ContactsTable.firstName, `%${parts[0]}%`), ilike(ContactsTable.lastName, `%${parts[0]}%`))
          );
        }
      }

      if (query.filters.searchContactEmail) {
        whereConditions.push(ilike(ContactsTable.email, `%${query.filters.searchContactEmail}%`));
      }

      if (query.filters.searchContactJobTitle) {
        whereConditions.push(ilike(ContactsTable.jobTitle, `%${query.filters.searchContactJobTitle}%`));
      }

      if (query.filters.searchContactStage) {
        whereConditions.push(ilike(ContactsTable.stage, `%${query.filters.searchContactStage}%`));
      }

      if (query.filters.companyId) {
        whereConditions.push(eq(ContactsTable.companyId, query.filters.companyId));
      }

      if (whereConditions.length > 0) {
        sqlQuery = sqlQuery.where(and(...whereConditions));
      }

      if (query.sort.length > 0) {
        query.sort.forEach((sort) => {
          const column = contactSortFieldMap[sort.field];
          return sort.direction === SortDirection.Desc ? desc(column) : asc(column);
        });
      } else {
        orderClauses.push(ContactsTable.createdAt);
      }

      sqlQuery = sqlQuery
        .orderBy(...orderClauses)
        .limit(query.pagination.limit)
        .offset(query.pagination.offset);

      const contacts = await sqlQuery;

      return {
        items: contacts.map(({ contact, company }) => contactWithRelationsToOverviewRow({ contact, company })),
        totalCount: contacts[0]?.totalCount ?? 0,
      };
    });
  }
}
