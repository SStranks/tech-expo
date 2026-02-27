import type { CompanyRepository } from '#Models/domain/company/company.repository.js';
import type { ContactRepository } from '#Models/domain/contact/contact.repository.js';
import type {
  AddContactNoteCommand,
  AddContactNoteReturn,
  ContactId,
  CreateContactCommand,
  RemoveContactNoteCommand,
  UpdateContactCommand,
  UpdateContactNoteCommand,
  UpdateContactNoteReturn,
} from '#Models/domain/contact/contact.types.js';
import type { ContactNoteId } from '#Models/domain/contact/note/note.types.js';
import type { ContactReadModel } from '#Models/query/contact/contacts.read-model.js';
import type {
  ContactNoteReadRow,
  ContactsOverviewPaginated,
  ContactsOverviewQuery,
  PaginatedCompanyContacts,
  PaginatedCompanyContactsQuery,
} from '#Models/query/contact/contacts.read-model.types.js';
import type { UserReadModel } from '#Models/query/user/users.read-model.js';
import type { RequestContext } from '#Types/request-context.js';

import { Contact, type PersistedContact } from '#Models/domain/contact/contact.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';
import { NotFoundError } from '#Utils/errors/NotFoundError.js';

interface ContactServicesDependencies {
  contactRepository: ContactRepository;
  contactReadModel: ContactReadModel;
  companyRepository: CompanyRepository;
  userReadModel: UserReadModel;
}

interface IContactService {
  getContactById(id: ContactId): Promise<PersistedContact>;
  getPaginatedContactsForCompany(query: PaginatedCompanyContactsQuery): Promise<PaginatedCompanyContacts>;
  createContact(cmd: CreateContactCommand): Promise<PersistedContact>;
  updateContactById(cmd: UpdateContactCommand): Promise<PersistedContact>;
  removeContactById(id: ContactId): Promise<ContactId>;
  findNotesForContactById(id: ContactId): Promise<ContactNoteReadRow[]>;
  addContactNote(cmd: AddContactNoteCommand, ctx: RequestContext): Promise<AddContactNoteReturn>;
  updateContactNote(cmd: UpdateContactNoteCommand, ctx: RequestContext): Promise<UpdateContactNoteReturn>;
  removeContactNote(cmd: RemoveContactNoteCommand, ctx: RequestContext): Promise<ContactNoteId>;
}

export class ContactService implements IContactService {
  private readonly contactRepository: ContactRepository;
  private readonly contactReadModel: ContactReadModel;
  private readonly companyRepository: CompanyRepository;
  private readonly userReadModel: UserReadModel;

  constructor({ companyRepository, contactReadModel, contactRepository, userReadModel }: ContactServicesDependencies) {
    this.contactRepository = contactRepository;
    this.contactReadModel = contactReadModel;
    this.companyRepository = companyRepository;
    this.userReadModel = userReadModel;
  }

  // ------- COMMANDs ------ //

  async getContactById(id: ContactId): Promise<PersistedContact> {
    const contact = await this.contactRepository.findContactById(id);

    if (!contact) throw new NotFoundError({ context: { contactId: id }, resource: 'Contact' });

    return contact;
  }

  async createContact(cmd: CreateContactCommand): Promise<PersistedContact> {
    const newContact = Contact.create({
      ...cmd,
      image: cmd.image ?? undefined,
    });

    return this.contactRepository.save(newContact);
  }

  async updateContactById(cmd: UpdateContactCommand): Promise<PersistedContact> {
    const contact = await this.getContactById(cmd.id);

    if (cmd.companyId) {
      const company = await this.companyRepository.findCompanyById(cmd.companyId);
      if (!company) throw new NotFoundError({ context: { companyId: cmd.companyId }, resource: 'Company' });
    }

    contact.updateProfile(cmd);

    return this.contactRepository.save(contact);
  }

  removeContactById(id: ContactId): Promise<ContactId> {
    return this.contactRepository.remove(id);
  }

  async addContactNote(cmd: AddContactNoteCommand, ctx: RequestContext): Promise<AddContactNoteReturn> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const contact = await this.getContactById(cmd.contactId);

    const { symbol } = contact.addNote({
      contactId: contact.id,
      content: cmd.note,
      createdByUserProfileId: asUserProfileId(userProfile.id),
    });

    await this.contactRepository.save(contact);
    const contactNote = contact.findNoteBySymbol(symbol);
    if (!contactNote) throw new NotFoundError({ resource: 'Contact-note' });

    return { contact, contactNote };
  }

  async updateContactNote(cmd: UpdateContactNoteCommand, ctx: RequestContext): Promise<UpdateContactNoteReturn> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const contact = await this.getContactById(cmd.contactId);
    const contactNote = await this.contactReadModel.findContactNoteByContactNoteId(cmd.contactNoteId);

    if (!contactNote)
      throw new NotFoundError({ context: { contactNoteId: cmd.contactNoteId }, resource: 'Contact-note' });

    const { symbol } = contact.updateNote(
      {
        id: cmd.contactNoteId,
        contactId: contact.id,
        content: cmd.note,
        createdAt: contactNote.createdAt,
        createdByUserProfileId: userProfile.id,
      },
      userProfile.id
    );

    await this.contactRepository.save(contact);
    const updatedContactNote = contact.findNoteBySymbol(symbol);
    if (!updatedContactNote) throw new NotFoundError({ resource: 'Contact-note' });

    return { contact, contactNote: updatedContactNote };
  }

  async removeContactNote(cmd: RemoveContactNoteCommand, ctx: RequestContext): Promise<ContactNoteId> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const contact = await this.getContactById(cmd.contactId);
    const contactNote = await this.contactReadModel.findContactNoteByContactNoteId(cmd.contactNoteId);

    if (!contactNote)
      throw new NotFoundError({ context: { contactNoteId: cmd.contactNoteId }, resource: 'Contact-note' });

    contact.removeNote(cmd.contactNoteId, userProfile.id);
    await this.contactRepository.save(contact);
    return cmd.contactNoteId;
  }

  // ------- QUERIES ------- //

  async findContactsOverview(query: ContactsOverviewQuery): Promise<ContactsOverviewPaginated> {
    return this.contactReadModel.findContactOverview(query);
  }

  async findNotesForContactById(contactId: ContactId): Promise<ContactNoteReadRow[]> {
    return this.contactReadModel.findContactNotesByContactId(contactId);
  }

  getPaginatedContactsForCompany(_query: PaginatedCompanyContactsQuery): Promise<PaginatedCompanyContacts> {
    throw new Error('Method not implemented.');
  }
}
