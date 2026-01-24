import type { ContactRepository } from '#Models/domain/contact/contact.repository.js';
import type { ContactReadModel } from '#Models/query/contact/contacts.read-model.js';
import type {
  PaginatedCompanyContacts,
  PaginatedCompanyContactsQuery,
} from '#Models/query/contact/contacts.read-model.types.js';

interface IContactService {
  getPaginatedContactsForCompany(query: PaginatedCompanyContactsQuery): Promise<PaginatedCompanyContacts>;
}

export class ContactService implements IContactService {
  constructor(
    private readonly contactsRepository: ContactRepository,
    private readonly contactsReadModel: ContactReadModel
  ) {}

  // ------- COMMANDs ------ //
  // ------- QUERIES ------- //

  getPaginatedContactsForCompany(_query: PaginatedCompanyContactsQuery): Promise<PaginatedCompanyContacts> {
    throw new Error('Method not implemented.');
  }
}
