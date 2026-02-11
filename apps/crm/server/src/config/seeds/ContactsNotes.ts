import type { PostgresClient } from '#Config/dbPostgres.js';
import type { ContactsNotesTableInsert } from '#Config/schema/contacts/ContactsNotes.ts';

import { ContactsNotesTable } from '#Config/schema/contacts/ContactsNotes.js';

import { generateContactNotes } from './generators/ContactNotes.js';

export type SeedContactNotesContact = Awaited<ReturnType<typeof getAllContacts>>[number];
export type SeedContactNotesUsers = Awaited<ReturnType<typeof getAllUsers>>;

const getAllContacts = async (db: PostgresClient) => {
  return db.query.ContactsTable.findMany({
    columns: { id: true, firstName: true, lastName: true, stage: true },
    with: {
      company: {
        columns: { name: true, industry: true },
      },
    },
  });
};

const getAllUsers = async (db: PostgresClient) => {
  return db.query.UserProfileTable.findMany({ columns: { id: true, firstName: true } });
};

export default async function seedContactsNotes(db: PostgresClient) {
  const allContacts = await getAllContacts(db);
  const allUsers = await getAllUsers(db);

  // --------- CONTACTS NOTES TABLE --------- //
  const contactsNotesInsertionData: ContactsNotesTableInsert[] = [];

  allContacts.forEach((contact: SeedContactNotesContact) => {
    const notes = generateContactNotes(contact, allUsers);
    contactsNotesInsertionData.push(...notes);
  });

  await db.insert(ContactsNotesTable).values(contactsNotesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: ContactsNotes.ts');
}
