import type { UUID as UUIDv4 } from 'node:crypto';

import type { CountryId } from '../country/country.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { BusinessType, CompanyId, CompanySize } from './company.types.js';
import type {
  CompanyNoteCreateProps,
  CompanyNoteHydrationProps,
  NewCompanyNote,
  PersistedCompanyNote,
} from './note/note.js';
import type { CompanyNoteId } from './note/note.types.js';

import DomainError from '#Utils/errors/DomainError.js';

import { CompanyNote } from './note/note.js';

type CompanyProps = {
  name: string;
  size: CompanySize;
  totalRevenue?: string;
  industry: string;
  businessType: BusinessType;
  countryId: CountryId;
  website?: string;
};

type CompanyCreateProps = CompanyProps;
type CompanyHydrationProps = CompanyCreateProps & { id: CompanyId; createdAt: Date };

export type NewCompany = InstanceType<typeof NewCompanyImpl>;
export type PersistedCompany = InstanceType<typeof PersistedCompanyImpl>;

/*
  Hydration rules:
    - By default, Company is rehydrated WITHOUT notes.
    - Notes are treated as write-side entities and are only hydrated when required for command execution.
    - Read operations MUST use CompanyReadModel.
    - This prevents loading large note collections during queries.
 */
export abstract class Company {
  private _name: string;
  private _size: CompanySize;
  private _totalRevenue?: string;
  private _industry: string;
  private _businessType: BusinessType;
  private _countryId: CountryId;
  private _website?: string;

  private _notes: PersistedCompanyNote[] = [];
  private _addedNotes: NewCompanyNote[] = [];
  private _removedNoteIds: CompanyNoteId[] = [];
  private _updatedNotes: PersistedCompanyNote[] = [];

  private _rootDirty: boolean = false;

  protected constructor(props: CompanyProps) {
    this._name = props.name;
    this._size = props.size;
    this._totalRevenue = props.totalRevenue;
    this._industry = props.industry;
    this._businessType = props.businessType;
    this._countryId = props.countryId;
    this._website = props.website;
  }

  static create(props: CompanyCreateProps): NewCompany {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Company.create() call!
    return new NewCompanyImpl(props);
  }

  static rehydrate(props: CompanyHydrationProps): PersistedCompany {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Company.rehydrate() call!
    return new PersistedCompanyImpl(props);
  }

  static rehydrateForWrite(props: CompanyHydrationProps, notes: PersistedCompanyNote[]): PersistedCompany {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Company.rehydrateForWrite() call!
    const company = new PersistedCompanyImpl(props);
    company.commit(notes);
    return company;
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get isRootDirty() {
    return this._rootDirty;
  }

  get name() {
    return this._name;
  }

  get size() {
    return this._size;
  }

  get totalRevenue() {
    return this._totalRevenue;
  }

  get industry() {
    return this._industry;
  }

  get businessType() {
    return this._businessType;
  }

  get countryId() {
    return this._countryId;
  }

  get website() {
    return this._website;
  }

  get notes() {
    return this._notes;
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
    this._name = name;
    this._rootDirty = true;
  }

  updateMarketTier(newTier: CompanySize) {
    this._size = newTier;
    this._rootDirty = true;
  }

  updateTotalRevenue(newRevenue: string) {
    this._totalRevenue = newRevenue;
    this._rootDirty = true;
  }

  changeIndustry(industry: string) {
    this._industry = industry;
    this._rootDirty = true;
  }

  changeBusinessType(businessType: BusinessType) {
    this._businessType = businessType;
    this._rootDirty = true;
  }

  moveCountry(country: CountryId) {
    this._countryId = country;
    this._rootDirty = true;
  }

  updateWebsite(website: string) {
    this._website = website;
    this._rootDirty = true;
  }
  // #endregion actions/profile

  // --------------------------
  // Domain actions – Company Notes
  // --------------------------
  // #region actions/notes
  addNote(props: CompanyNoteCreateProps): NewCompanyNote {
    const note = CompanyNote.create(props);
    this._addedNotes.push(note);
    return note;
  }

  removeNote(id: CompanyNoteId, actor: UserProfileId) {
    const noteIndex = this._notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) throw new DomainError({ message: 'Company-note not found' });
    // eslint-disable-next-line security/detect-object-injection
    if (this._notes[noteIndex].createdByUserProfileId !== actor)
      throw new DomainError({ message: 'Company-note not created by this user' });

    this._removedNoteIds.push(id);
    this._notes = this._notes.splice(noteIndex, 1);
  }

  updateNote(props: CompanyNoteHydrationProps, actor: UserProfileId): PersistedCompanyNote {
    if (props.createdByUserProfileId !== actor)
      throw new DomainError({ message: 'Company-note not created by this user' });

    const note = CompanyNote.rehydrate(props);
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

  commit(notes: PersistedCompanyNote[]) {
    this._notes = [...this._notes, ...notes];
    this._addedNotes = [];
    this._updatedNotes = [];
    this._removedNoteIds = [];
  }
  // #endregion actions/notes
}

class NewCompanyImpl extends Company {
  constructor(props: CompanyCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedCompanyImpl {
    return false;
  }
}

class PersistedCompanyImpl extends Company {
  private readonly _id: CompanyId;
  private readonly _createdAt: Date;

  constructor(props: CompanyHydrationProps) {
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

  isPersisted(): this is PersistedCompanyImpl {
    return true;
  }
}
