import type { UUID as UUIDv4 } from 'node:crypto';

import type { CompanyId } from '../company/company.types.js';
import type { TimeZoneId } from '../timezone/timezone.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { ContactId, ContactStage } from './contact.types.js';
import type {
  ContactNoteCreateProps,
  ContactNoteHydrationProps,
  NewContactNote,
  PersistedContactNote,
} from './note/note.js';
import type { ContactNoteId } from './note/note.types.js';

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
  company: CompanyId;
  jobTitle: string;
  stage: ContactStage;
  timezone: TimeZoneId | null;
  image: string | null;
};

type ContactCreateProps = ContactProps;
type ContactHydrationProps = ContactCreateProps & { id: ContactId; createdAt: Date };

export type NewContact = InstanceType<typeof NewContactImpl>;
export type PersistedContact = InstanceType<typeof PersistedContactImpl>;

export abstract class Contact {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _phone: string;
  private _company: CompanyId;
  private _jobTitle: string;
  private _stage: ContactStage;
  private _timezone: TimeZoneId | null;
  private _image: string | null;

  private _notes: PersistedContactNote[] = [];
  private _addedNotes: NewContactNote[] = [];
  private _removedNoteIds: ContactNoteId[] = [];
  private _updatedNotes: PersistedContactNote[] = [];

  private _rootDirty: boolean = false;

  constructor(props: ContactProps) {
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._phone = props.phone;
    this._company = props.company;
    this._jobTitle = props.jobTitle;
    this._stage = props.stage;
    this._timezone = props.timezone;
    this._image = props.image;
  }

  static create(props: ContactCreateProps): NewContact {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Contact.create() call!
    return new NewContactImpl(props);
  }

  static rehydrate(props: ContactHydrationProps): PersistedContact {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Contact.rehydrate() call!
    return new PersistedContactImpl(props);
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get isRootDirty() {
    return this._rootDirty;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get email() {
    return this._email;
  }

  get phone() {
    return this._phone;
  }

  get company() {
    return this._company;
  }

  get jobTitle() {
    return this._jobTitle;
  }

  get stage() {
    return this._stage;
  }

  get timezone() {
    return this._timezone;
  }

  get image() {
    return this._image;
  }
  // #endregion getters

  abstract isPersisted(): boolean;

  // --------------------------
  // Domain actions – Profile updates
  // --------------------------
  // #region actions/profile
  updateProfile(input: Partial<Omit<ContactCreateProps, 'id'>>) {
    if (input.firstName !== undefined) this.changeFirstName(input.firstName);
    if (input.lastName !== undefined) this.changeFirstName(input.lastName);
    if (input.email !== undefined) this.changeEmail(input.email);
    if (input.phone !== undefined) this.changePhone(input.phone);
    if (input.company !== undefined) this.changeCompany(input.company);
    if (input.jobTitle !== undefined) this.changeJobTitle(input.jobTitle);
    if (input.timezone !== undefined) this.shiftTimeZone(input.timezone);
    if (input.stage !== undefined) this.shiftStage(input.stage);
    if (input.image !== undefined) this.updateContactAvatar(input.image);
  }

  changeFirstName(newFirstName: string) {
    const firstName = zParseDomain(FirstNameSchema, newFirstName);
    if (this._firstName === firstName) return;

    this._firstName = firstName;
    this._rootDirty = true;
  }

  changeLastName(newLastName: string) {
    const lastName = zParseDomain(LastNameSchema, newLastName);
    if (this._lastName === lastName) return;

    this._lastName = lastName;
    this._rootDirty = true;
  }

  changeEmail(newEmail: string) {
    const email = zParseDomain(EmailSchema, newEmail);
    if (this._email === email) return;

    this._email = email;
    this._rootDirty = true;
  }

  changePhone(newPhone: string) {
    const phone = zParseDomain(PhoneSchema, newPhone);
    if (this._phone === phone) return;

    this._phone = phone;
    this._rootDirty = true;
  }

  changeCompany(companyId: string) {
    const parsedCompanyId = zParseDomain(CompanyIdSchema, companyId);
    if (this._company === parsedCompanyId) return;

    this._company = asCompanyId(parsedCompanyId);
    this._rootDirty = true;
  }

  changeJobTitle(jobTitle: string) {
    const parsedJobTitle = zParseDomain(JobTitleSchema, jobTitle);
    if (this._jobTitle === parsedJobTitle) return;

    this._jobTitle = parsedJobTitle;
    this._rootDirty = true;
  }

  shiftStage(newStage: ContactStage) {
    const parsedStage = zParseDomain(ContactStageSchema, newStage);

    if (this._stage === parsedStage) return;

    this._stage === parsedStage;
    this._rootDirty = true;
  }

  shiftTimeZone(newTimeZone: TimeZoneId | null) {
    const parsedTimeZone = zParseDomain(TimezoneIdSchema, newTimeZone);
    if (!parsedTimeZone || this._timezone === parsedTimeZone) return;

    this._timezone = asTimeZoneId(parsedTimeZone);
    this._rootDirty = true;
  }

  updateContactAvatar(newImage: string | null) {
    const parsedImage = zParseDomain(AvatarUrlSchema, newImage);
    if (!parsedImage || this._image === parsedImage) return;

    this._image;
    this._rootDirty = true;
  }
  // #endregion actions/profile

  // --------------------------
  // Domain actions – Contact Notes
  // --------------------------
  // #region actions/notes
  addNote(props: ContactNoteCreateProps): NewContactNote {
    const note = ContactNote.create(props);
    this._addedNotes.push(note);
    return note;
  }

  removeNote(id: ContactNoteId, actor: UserProfileId) {
    const noteIndex = this._notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) throw new DomainError({ message: 'Contact-note not found' });
    // eslint-disable-next-line security/detect-object-injection
    if (this._notes[noteIndex].createdBy !== actor)
      throw new DomainError({ message: 'Contact-note not created by this user' });

    this._removedNoteIds.push(id);
    this._notes = this._notes.splice(noteIndex, 1);
  }

  updateNote(props: ContactNoteHydrationProps, actor: UserProfileId): PersistedContactNote {
    if (props.createdBy !== actor) throw new DomainError({ message: 'Contact-note not created by this user' });

    const note = ContactNote.rehydrate(props);
    this._notes.push(note);
    this._updatedNotes.push(note);
    return note;
  }

  findNoteBySymbol(symbol: UUIDv4) {
    return this._notes.find((n) => n.symbol === symbol);
  }

  pullChanges() {
    return {
      addedNotes: this._addedNotes,
      removedNoteIds: this._removedNoteIds,
      updatedNotes: this._updatedNotes,
    };
  }

  commit(notes: PersistedContactNote[]) {
    this._notes = [...this._notes, ...notes];
    this._addedNotes = [];
    this._updatedNotes = [];
    this._removedNoteIds = [];
  }
  // #endregion actions/notes
}

class NewContactImpl extends Contact {
  constructor(props: ContactCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedContactImpl {
    return false;
  }
}

class PersistedContactImpl extends Contact {
  private readonly _id: ContactId;
  private readonly _createdAt: Date;

  constructor(props: ContactHydrationProps) {
    super(props);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedContactImpl {
    return true;
  }
}
