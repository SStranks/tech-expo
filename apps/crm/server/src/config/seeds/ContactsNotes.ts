import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TContactsNotesTableInsert } from '#Config/schema/index.js';

import { ContactsNotesTable } from '#Config/schema/index.js';

import { generateContactNotes } from './generators/ContactNotes.js';

export type TSeedContactNotesContact = Awaited<ReturnType<typeof getAllContacts>>[number];
export type TSeedContactNotesUsers = Awaited<ReturnType<typeof getAllUsers>>;

const getAllContacts = async (db: TPostgresDB) => {
  return await db.query.ContactsTable.findMany({
    columns: { id: true, firstName: true, lastName: true, stage: true },
    with: {
      company: {
        columns: { name: true, industry: true },
      },
    },
  });
};

const getAllUsers = async (db: TPostgresDB) => {
  return await db.query.UserProfileTable.findMany({ columns: { id: true, firstName: true } });
};

export default async function seedContactsNotes(db: TPostgresDB) {
  const allContacts = await getAllContacts(db);
  const allUsers = await getAllUsers(db);

  // --------- CONTACTS NOTES TABLE --------- //
  const contactsNotesInsertionData: TContactsNotesTableInsert[] = [];

  allContacts.forEach((contact: TSeedContactNotesContact) => {
    const notes = generateContactNotes(contact, allUsers);
    contactsNotesInsertionData.push(...notes);
  });

  await db.insert(ContactsNotesTable).values(contactsNotesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: ContactsNotes.ts');
}
