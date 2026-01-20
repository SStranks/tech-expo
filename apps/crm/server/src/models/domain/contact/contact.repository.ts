import type { NewContact, PersistedContact } from './contact.js';
import type { ContactId } from './contact.types.js';

export interface ContactRepository {
  save(contact: NewContact | PersistedContact): Promise<PersistedContact>;
  remove(id: ContactId): Promise<ContactId>;
  findContactById(id: ContactId): Promise<PersistedContact | null>;
}
