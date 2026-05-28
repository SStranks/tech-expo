import type { NewContact, PersistedContact } from './contact.js';
import type { ContactId } from './contact.types.js';

export interface ContactRepository {
  findContactById(id: ContactId): Promise<PersistedContact | null>;
  remove(id: ContactId): Promise<ContactId>;
  save(contact: NewContact | PersistedContact): Promise<PersistedContact>;
}
