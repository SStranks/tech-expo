import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type {
  ContactsTableInsert,
  ContactsTableSelect,
  ContactsTableUpdate,
} from '#Config/schema/contacts/Contacts.js';

export interface ContactRepository {
  deleteById(id: UUID): Promise<ContactsTableSelect['id']>;
  deleteByIds(ids: UUID[]): Promise<ContactsTableSelect['id'][]>;
  findById(id: UUID): Promise<ContactsTableSelect | null>;
  findByIds(ids: UUID[]): Promise<ContactsTableSelect[]>;
  insert(company: ContactsTableInsert): Promise<ContactsTableSelect>;
  insertMany(companies: ContactsTableInsert[]): Promise<ContactsTableSelect[]>;
  updateById(id: UUID, company: ContactsTableUpdate): Promise<ContactsTableSelect>;
  updateByIds(ids: UUID[], companies: ContactsTableUpdate[]): Promise<ContactsTableSelect[]>;
}
