import type { CountryId } from '../country/country.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { BusinessType, CompanyId, CompanySize } from './company.types.js';
import type {
  CompanyNoteCreateProps,
  CompanyNoteHydrationProps,
  NewCompanyNote,
  PersistedCompanyNote,
} from './note/note.js';
import type { CompanyNoteClientId, CompanyNoteId } from './note/note.types.js';

import DomainError from '#Utils/errors/DomainError.js';

import { CompanyNote } from './note/note.js';

type CompanyProps = {
  name: string;
  size: CompanySize;
  totalRevenue: string;
  industry: string;
  businessType: BusinessType;
  countryId: CountryId;
  website?: string;
};

type CompanyCreateProps = CompanyProps;
type CompanyHydrationProps = CompanyCreateProps & { id: CompanyId; createdAt: Date };

export interface NewCompany extends Company {
  isPersisted(): this is PersistedCompany;
}

export interface PersistedCompany extends Company {
  readonly id: CompanyId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedCompany;
}

class CompanyState {
  notes: PersistedCompanyNote[] = [];
  addedNotes: NewCompanyNote[] = [];
  removedNoteIds: CompanyNoteId[] = [];
  updatedNotes: PersistedCompanyNote[] = [];
  dirtyFields: Set<keyof CompanyProps> = new Set();
}

/*
  Hydration rules:
    - By default, Company is rehydrated WITHOUT notes.
    - Notes are treated as write-side entities and are only hydrated when required for command execution.
    - Read operations MUST use CompanyReadModel.
    - This prevents loading large note collections during queries.
 */
export abstract class Company {
  private readonly _props: CompanyProps;
  protected _internal: CompanyState;

  protected constructor(props: CompanyProps, newCompany?: NewCompanyImpl) {
    this._props = { ...props };
    this._internal = newCompany?._internal ?? new CompanyState();
  }

  static create(props: CompanyCreateProps): NewCompany {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Company.create() call!
    return new NewCompanyImpl(props);
  }

  static rehydrate(props: CompanyHydrationProps): PersistedCompany {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Company.rehydrate() call!
    return new PersistedCompanyImpl(props);
  }

  static promote(newCompany: NewCompanyImpl, persisted: { id: CompanyId; createdAt: Date }): PersistedCompany {
    const props = { ...newCompany._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.promote() call!
    return new PersistedCompanyImpl(props, newCompany);
  }

  static rehydrateForWrite(props: CompanyHydrationProps, notes: PersistedCompanyNote[]): PersistedCompany {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Company.rehydrateForWrite() call!
    const company = new PersistedCompanyImpl(props);
    company.commitNotes(notes);
    return company;
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get name() {
    return this._props.name;
  }

  get size() {
    return this._props.size;
  }

  get totalRevenue() {
    return this._props.totalRevenue;
  }

  get industry() {
    return this._props.industry;
  }

  get businessType() {
    return this._props.businessType;
  }

  get countryId() {
    return this._props.countryId;
  }

  get website() {
    return this._props.website;
  }
  // #endregion getters

  abstract isPersisted(): boolean;

  // --------------------------
  // Domain actions – Profile updates
  // --------------------------
  // #region actions/profile
  updateProfile(input: Partial<Omit<CompanyCreateProps, 'id'>>) {
    if (input.name !== undefined) this.rebrandCompany(input.name);
    if (input.size !== undefined) this.updateMarketTier(input.size);
    if (input.totalRevenue !== undefined) this.updateTotalRevenue(input.totalRevenue);
    if (input.industry !== undefined) this.changeIndustry(input.industry);
    if (input.businessType !== undefined) this.changeBusinessType(input.businessType);
    if (input.countryId !== undefined) this.moveCountry(input.countryId);
    if (input.website !== undefined) this.updateWebsite(input.website);
  }

  rebrandCompany(newName: string) {
    const name = newName.trim();
    if (name.length === 0) {
      throw new Error('Company name cannot be empty');
    }
    this._props.name = name;
    this._internal.dirtyFields.add('name');
  }

  updateMarketTier(newTier: CompanySize) {
    this._props.size = newTier;
    this._internal.dirtyFields.add('size');
  }

  updateTotalRevenue(newRevenue: string) {
    if (!/^\d+\.\d{2}$/.test(newRevenue)) throw new Error('Invalid revenue format');
    this._props.totalRevenue = newRevenue;
    this._internal.dirtyFields.add('totalRevenue');
  }

  changeIndustry(industry: string) {
    this._props.industry = industry;
    this._internal.dirtyFields.add('industry');
  }

  changeBusinessType(businessType: BusinessType) {
    this._props.businessType = businessType;
    this._internal.dirtyFields.add('businessType');
  }

  moveCountry(country: CountryId) {
    this._props.countryId = country;
    this._internal.dirtyFields.add('countryId');
  }

  updateWebsite(website: string) {
    this._props.website = website;
    this._internal.dirtyFields.add('website');
  }
  // #endregion actions/profile

  // --------------------------
  // Domain actions – Company Notes
  // --------------------------
  // #region actions/notes
  addNote(props: CompanyNoteCreateProps): NewCompanyNote {
    const note = CompanyNote.create(props);
    this._internal.addedNotes.push(note);
    return note;
  }

  removeNote(id: CompanyNoteId, actor: UserProfileId) {
    const noteIndex = this._internal.notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) throw new DomainError({ message: 'Company-note not found' });
    if (this._internal.notes[`${noteIndex}`].createdByUserProfileId !== actor)
      throw new DomainError({ message: 'Company-note not created by this user' });

    this._internal.removedNoteIds.push(id);
    this._internal.notes.splice(noteIndex, 1);
  }

  updateNote(props: CompanyNoteHydrationProps, actor: UserProfileId): PersistedCompanyNote {
    const note = this._internal.notes.find((note) => note.id === props.id);
    if (!note) throw new DomainError({ message: 'Note not found' });

    note.updateContent(props.content, actor);
    this._internal.updatedNotes.push(note);
    return note;
  }

  findNoteByClientId(clientId: CompanyNoteClientId) {
    return this._internal.notes.find((n) => n.clientId === clientId);
  }

  getNoteByClientId(clientId: CompanyNoteClientId) {
    const note = this._internal.notes.find((n) => n.clientId === clientId);
    if (!note) throw new DomainError({ message: 'Note not found' });
    return note;
  }
  // #endregion actions/notes

  // --------------------------
  // Domain actions – Commit
  // --------------------------
  // #region actions/commit
  pullNoteChanges() {
    return {
      addedNotes: this._internal.addedNotes,
      removedNoteIds: this._internal.removedNoteIds,
      updatedNotes: this._internal.updatedNotes,
    };
  }

  commit() {
    this._internal.dirtyFields.clear();
  }

  commitNotes(newNotes: PersistedCompanyNote[]) {
    this._internal.notes.push(...newNotes);
    this._internal.addedNotes = [];
    this._internal.updatedNotes = [];
    this._internal.removedNoteIds = [];
  }

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof CompanyProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<CompanyProps> {
    const update: Partial<CompanyProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof CompanyProps>(key: K) => {
      // eslint-disable-next-line security/detect-object-injection
      update[key] = this._props[key];
    });

    return update;
  }
  // #endregion actions/commit
}

class NewCompanyImpl extends Company {
  constructor(props: CompanyCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedCompany {
    return false;
  }
}

class PersistedCompanyImpl extends Company {
  private readonly _id: CompanyId;
  private readonly _createdAt: Date;

  constructor(props: CompanyHydrationProps, newCompany?: NewCompanyImpl) {
    super(props, newCompany);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedCompany {
    return true;
  }
}
