import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { TCompaniesTableSelect, TContactsNotesTableInsert } from '#Config/schema/index.js';

import { ContactsNotesTable } from '#Config/schema/index.js';

import { generateContactNotes } from './generators/ContactNotes.js';

export type TContactsQueryContactsNotes = Pick<TContactsTableSelect, 'id' | 'stage' | 'firstName' | 'lastName'> & {
  company: Pick<TCompaniesTableSelect, 'companyName' | 'industry'>;
};

export default async function seedContactsNotes(db: TPostgresDB) {
  const allContacts: TContactsQueryContactsNotes[] = await db.query.ContactsTable.findMany({
    columns: { id: true, firstName: true, lastName: true, stage: true },
    with: {
      company: {
        columns: { companyName: true, industry: true },
      },
    },
  });
  const allUsers = await db.query.UserProfileTable.findMany({ columns: { id: true, firstName: true } });

  // --------- CONTACTS NOTES --------- //
  const contactsNotesData: TContactsNotesTableInsert[] = [];

  allContacts.forEach((contact: TContactsQueryContactsNotes) => {
    const notes = generateContactNotes(contact, allUsers);
    contactsNotesData.push(...notes);
  });

  await db.insert(ContactsNotesTable).values(contactsNotesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: ContactsNotes.ts');
}
