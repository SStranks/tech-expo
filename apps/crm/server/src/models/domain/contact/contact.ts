import type { CompanyId } from '../company/company.types.js';
import type { TimeZoneId } from '../timezone/timezone.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { ContactId, ContactStage } from './contact.types.js';
import type {
  ContactNoteCreateProps,
  ContactNoteUpdateProps,
  NewContactNote,
  PersistedContactNote,
} from './note/note.js';
import type { ContactNoteClientId, ContactNoteId } from './note/note.types.js';

import DomainError from '#Utils/errors/DomainError.js';
import { zParseDomain } from '#Utils/zod/zParse.js';

import { asCompanyId } from '../company/company.mapper.js';
import { asTimeZoneId } from '../timezone/timezone.mapper.js';
import {
  AvatarUrlSchema,
  CompanyIdSchema,
  ContactStageSchema,
  EmailSchema,
  FirstNameSchema,
  JobTitleSchema,
  LastNameSchema,
  PhoneSchema,
  TimezoneIdSchema,
} from './contact.schemas.js';
import { ContactNote } from './note/note.js';

type ContactProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: CompanyId;
  jobTitle: string;
  stage: ContactStage;
  timezoneId?: TimeZoneId;
  image?: string;
};

type ContactCreateProps = ContactProps;
type ContactHydrationProps = ContactCreateProps & { id: ContactId; createdAt: Date };

export interface NewContact extends Contact {
  isPersisted(): this is PersistedContact;
}

export interface PersistedContact extends Contact {
  readonly id: ContactId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedContact;
}

class ContactState {
  noteById: Map<ContactNoteId, PersistedContactNote> = new Map();
  noteByClientId: Map<ContactNoteClientId, ContactNoteId> = new Map();
  addedNotes: Map<ContactNoteClientId, NewContactNote> = new Map();
  removedNoteIds: Set<ContactNoteId> = new Set();
  updatedNotes: Map<ContactNoteId, PersistedContactNote> = new Map();
  dirtyFields: Set<keyof ContactProps> = new Set();
}

export abstract class Contact {
  private readonly _props: ContactProps;
  protected _internal: ContactState;

  constructor(props: ContactProps, newContact?: NewContactImpl) {
    this._props = { ...props };
    this._internal = newContact?._internal ?? new ContactState();
  }

  static create(props: ContactCreateProps): NewContact {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Contact.create() call!
    return new NewContactImpl(props);
  }

  static rehydrate(props: ContactHydrationProps): PersistedContact {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Contact.rehydrate() call!
    return new PersistedContactImpl(props);
  }

  static promote(newContact: NewContactImpl, persisted: { id: ContactId; createdAt: Date }): PersistedContact {
    const props = { ...newContact._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Contact.promote() call!
    return new PersistedContactImpl(props, newContact);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get firstName() {
    return this._props.firstName;
  }

  get lastName() {
    return this._props.lastName;
  }

  get email() {
    return this._props.email;
  }

  get phone() {
    return this._props.phone;
  }

  get companyId() {
    return this._props.companyId;
  }

  get jobTitle() {
    return this._props.jobTitle;
  }

  get stage() {
    return this._props.stage;
  }

  get timezoneId() {
    return this._props.timezoneId;
  }

  get image() {
    return this._props.image;
  }
  // #endregion getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof ContactProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<ContactProps> {
    const update: Partial<ContactProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof ContactProps>(key: K) => {
      // eslint-disable-next-line security/detect-object-injection
      update[key] = this._props[key];
    });

    return update;
  }

  pullNoteChanges() {
    return {
      addedNotes: this._internal.addedNotes,
      removedNoteIds: this._internal.removedNoteIds,
      updatedNotes: this._internal.updatedNotes,
    };
  }
  // #endregion actions/internal

  // --------------------------
  // Domain actions – Commit
  // --------------------------
  // #region actions/commit

  commit() {
    this._internal.dirtyFields.clear();
  }

  commitNotes(newNotes: PersistedContactNote[]) {
    for (const note of newNotes) {
      this._internal.noteById.set(note.id, note);
      this._internal.noteByClientId.set(note.clientId, note.id);
    }

    this._internal.addedNotes.clear();
    this._internal.updatedNotes.clear();
    this._internal.removedNoteIds.clear();
  }
  // #endregion actions/commit

  // --------------------------
  // Domain actions – Contact
  // --------------------------
  // #region actions/contact

  updateProfile(input: Partial<Omit<ContactCreateProps, 'id'>>) {
    if (input.firstName !== undefined) this.changeFirstName(input.firstName);
    if (input.lastName !== undefined) this.changeFirstName(input.lastName);
    if (input.email !== undefined) this.changeEmail(input.email);
    if (input.phone !== undefined) this.changePhone(input.phone);
    if (input.companyId !== undefined) this.changeCompany(input.companyId);
    if (input.jobTitle !== undefined) this.changeJobTitle(input.jobTitle);
    if (input.timezoneId !== undefined) this.shiftTimeZone(input.timezoneId);
    if (input.stage !== undefined) this.shiftStage(input.stage);
    if (input.image !== undefined) this.updateContactAvatar(input.image);
  }

  changeFirstName(newFirstName: string) {
    const firstName = zParseDomain(FirstNameSchema, newFirstName);
    if (this._props.firstName === firstName) return;

    this._props.firstName = firstName;
    this._internal.dirtyFields.add('firstName');
  }

  changeLastName(newLastName: string) {
    const lastName = zParseDomain(LastNameSchema, newLastName);
    if (this._props.lastName === lastName) return;

    this._props.lastName = lastName;
    this._internal.dirtyFields.add('lastName');
  }

  changeEmail(newEmail: string) {
    const email = zParseDomain(EmailSchema, newEmail);
    if (this._props.email === email) return;

    this._props.email = email;
    this._internal.dirtyFields.add('email');
  }

  changePhone(newPhone: string) {
    const phone = zParseDomain(PhoneSchema, newPhone);
    if (this._props.phone === phone) return;

    this._props.phone = phone;
    this._internal.dirtyFields.add('phone');
  }

  changeCompany(companyId: string) {
    const parsedCompanyId = zParseDomain(CompanyIdSchema, companyId);
    if (this._props.companyId === parsedCompanyId) return;

    this._props.companyId = asCompanyId(parsedCompanyId);
    this._internal.dirtyFields.add('companyId');
  }

  changeJobTitle(jobTitle: string) {
    const parsedJobTitle = zParseDomain(JobTitleSchema, jobTitle);
    if (this._props.jobTitle === parsedJobTitle) return;

    this._props.jobTitle = parsedJobTitle;
    this._internal.dirtyFields.add('jobTitle');
  }

  shiftStage(newStage: ContactStage) {
    const parsedStage = zParseDomain(ContactStageSchema, newStage);

    if (this._props.stage === parsedStage) return;

    this._props.stage = parsedStage;
    this._internal.dirtyFields.add('stage');
  }

  shiftTimeZone(newTimeZone: TimeZoneId | null) {
    const parsedTimeZone = zParseDomain(TimezoneIdSchema, newTimeZone);
    if (!parsedTimeZone || this._props.timezoneId === parsedTimeZone) return;

    this._props.timezoneId = asTimeZoneId(parsedTimeZone);
    this._internal.dirtyFields.add('timezoneId');
  }

  updateContactAvatar(newImage: string | null) {
    const parsedImage = zParseDomain(AvatarUrlSchema, newImage);
    if (!parsedImage || this._props.image === parsedImage) return;

    this._props.image = parsedImage;
    this._internal.dirtyFields.add('image');
  }
  // #endregion actions/contact

  // --------------------------
  // Domain actions – Contact Notes
  // --------------------------
  // #region actions/notes

  addNote(props: ContactNoteCreateProps): NewContactNote {
    const note = ContactNote.create(props);
    this._internal.addedNotes.set(note.clientId, note);
    return note;
  }

  updateNote(props: ContactNoteUpdateProps, actor: UserProfileId): PersistedContactNote {
    const note = this._internal.noteById.get(props.id);
    if (!note) throw new DomainError({ message: 'Contact-note not found' });
    if (props.createdByUserProfileId !== actor)
      throw new DomainError({ message: 'Contact-note not created by this user' });

    note.updateNote(props);
    this._internal.updatedNotes.set(note.id, note);
    return note;
  }

  removeNote(id: ContactNoteId, actor: UserProfileId) {
    const note = this._internal.noteById.get(id);
    if (!note) throw new DomainError({ message: 'Contact-note not found' });
    if (note.createdByUserProfileId !== actor)
      throw new DomainError({ message: 'Contact-note not created by this user' });

    this._internal.removedNoteIds.add(id);
    this._internal.noteById.delete(id);
    this._internal.noteByClientId.delete(note.clientId);
  }

  findNoteByClientId(clientId: ContactNoteClientId) {
    return this._internal.noteByClientId.get(clientId);
  }

  getNoteByClientId(clientId: ContactNoteClientId) {
    const contactNoteUUID = this.findNoteByClientId(clientId);
    if (!contactNoteUUID) throw new DomainError({ message: 'Contact-note not found' });
    const contactNote = this._internal.noteById.get(contactNoteUUID);
    if (!contactNote) throw new DomainError({ message: 'Contact-note not found' });
    return contactNote;
  }
  // #endregion actions/notes
}

class NewContactImpl extends Contact {
  constructor(props: ContactCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedContact {
    return false;
  }
}

class PersistedContactImpl extends Contact {
  private readonly _id: ContactId;
  private readonly _createdAt: Date;

  constructor(props: ContactHydrationProps, newContact?: NewContactImpl) {
    super(props, newContact);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedContact {
    return true;
  }
}
