import type { CompanyRepository } from '#Models/domain/company/company.repository.js';
import type {
  AddCompanyNoteCommand,
  AddCompanyNoteReturn,
  CompanyId,
  CreateCompanyCommand,
  RemoveCompanyNoteCommand,
  UpdateCompanyCommand,
  UpdateCompanyNoteCommand,
  UpdateCompanyNoteReturn,
} from '#Models/domain/company/company.types.js';
import type { CompanyNote } from '#Models/domain/company/note/note.js';
import type { CompanyNoteId } from '#Models/domain/company/note/note.types.js';
import type { CountryRepository } from '#Models/domain/country/country.repository.js';
import type { CompanyReadModel } from '#Models/query/company/companies.read-model.js';
import type {
  CompaniesOverviewPaginated,
  CompaniesOverviewQuery,
  CompanyNoteReadRow,
} from '#Models/query/company/companies.read-model.types.js';
import type { UserReadModel } from '#Models/query/user/users.read-model.js';
import type { RequestContext } from '#Types/request-context.js';

import { Company, type PersistedCompany } from '#Models/domain/company/company.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';
import { NotFoundError } from '#Utils/errors/NotFoundError.js';

interface CompanyServiceDependencies {
  companyRepository: CompanyRepository;
  companyReadModel: CompanyReadModel;
  countryRepository: CountryRepository;
  userReadModel: UserReadModel;
}

interface ICompanyService {
  getCompanyById(id: CompanyId): Promise<PersistedCompany>;
  getCompanyNoteById(id: CompanyNoteId): Promise<CompanyNote>;
  createCompany(cmd: CreateCompanyCommand): Promise<PersistedCompany>;
  updateCompanyById(cmd: UpdateCompanyCommand): Promise<PersistedCompany>;
  removeCompanyById(id: CompanyId): Promise<CompanyId>;
  findNotesForCompanyById(id: CompanyId): Promise<CompanyNoteReadRow[]>;
  findCompaniesOverview(query: CompaniesOverviewQuery): Promise<CompaniesOverviewPaginated>;
  addCompanyNote(cmd: AddCompanyNoteCommand, ctx: RequestContext): Promise<AddCompanyNoteReturn>;
  updateCompanyNote(cmd: UpdateCompanyNoteCommand, ctx: RequestContext): Promise<UpdateCompanyNoteReturn>;
  removeCompanyNote(cmd: RemoveCompanyNoteCommand, ctx: RequestContext): Promise<CompanyNoteId>;
  // getCompaniesWithRelations(query: CompanyQuery): Promise<Company[]>;
}

export class CompanyService implements ICompanyService {
  private readonly companyRepository: CompanyRepository;
  private readonly companyReadModel: CompanyReadModel;
  private readonly countryRepository: CountryRepository;
  private readonly userReadModel: UserReadModel;

  constructor({ companyReadModel, companyRepository, countryRepository, userReadModel }: CompanyServiceDependencies) {
    this.companyReadModel = companyReadModel;
    this.companyRepository = companyRepository;
    this.countryRepository = countryRepository;
    this.userReadModel = userReadModel;
  }

  // ------- COMMANDs ------ //

  async getCompanyById(id: CompanyId): Promise<PersistedCompany> {
    const company = await this.companyRepository.findCompanyById(id);

    if (!company) throw new NotFoundError({ context: { companyId: id }, resource: 'Company' });

    return company;
  }

  async getCompanyNoteById(id: CompanyNoteId): Promise<CompanyNote> {
    const companyNote = await this.companyReadModel.findCompanyNoteByCompanyNoteId(id);

    if (!companyNote) throw new NotFoundError({ context: { companyNoteId: id }, resource: 'Company-note' });

    return companyNote;
  }

  async createCompany(cmd: CreateCompanyCommand): Promise<PersistedCompany> {
    const newCompany = Company.create({
      ...cmd,
      totalRevenue: cmd.totalRevenue ?? '0.00',
      website: cmd.website ?? undefined,
    });

    return this.companyRepository.save(newCompany);
  }

  async updateCompanyById(cmd: UpdateCompanyCommand): Promise<PersistedCompany> {
    const company = await this.getCompanyById(cmd.id);

    if (cmd.country) {
      const country = await this.countryRepository.findCountryById(cmd.country);
      if (!country) throw new NotFoundError({ context: { countryId: cmd.country }, resource: 'Country' });
    }

    company.updateProfile(cmd);

    return this.companyRepository.save(company);
  }

  removeCompanyById(id: CompanyId): Promise<CompanyId> {
    return this.companyRepository.remove(id);
  }

  async addCompanyNote(cmd: AddCompanyNoteCommand, ctx: RequestContext): Promise<AddCompanyNoteReturn> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });
    const company = await this.getCompanyById(cmd.companyId);

    const { clientId } = company.addNote({
      companyId: company.id,
      content: cmd.note,
      createdByUserProfileId: asUserProfileId(userProfile.id),
    });

    await this.companyRepository.save(company);
    const companyNote = company.findNoteByClientId(clientId);
    if (!companyNote) throw new NotFoundError({ resource: 'Company-note' });

    return { company, companyNote, userProfile };
  }

  async updateCompanyNote(cmd: UpdateCompanyNoteCommand, ctx: RequestContext): Promise<UpdateCompanyNoteReturn> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const company = await this.getCompanyById(cmd.companyId);
    const companyNote = await this.companyReadModel.findCompanyNoteByCompanyNoteId(cmd.companyNoteId);
    if (!companyNote)
      throw new NotFoundError({ context: { companyNoteId: cmd.companyNoteId }, resource: 'Company-note' });

    const { clientId } = company.updateNote(
      {
        id: cmd.companyNoteId,
        companyId: company.id,
        content: cmd.note,
        createdAt: companyNote.createdAt,
        createdByUserProfileId: userProfile.id,
      },
      userProfile.id
    );

    await this.companyRepository.save(company);
    const updatedCompanyNote = company.findNoteByClientId(clientId);
    if (!updatedCompanyNote) throw new NotFoundError({ resource: 'Company-note' });

    return { company, companyNote: updatedCompanyNote, userProfile };
  }

  async removeCompanyNote(cmd: RemoveCompanyNoteCommand, ctx: RequestContext): Promise<CompanyNoteId> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const company = await this.getCompanyById(cmd.companyId);
    const companyNote = await this.companyReadModel.findCompanyNoteByCompanyNoteId(cmd.companyNoteId);
    if (!companyNote)
      throw new NotFoundError({ context: { companyNoteId: cmd.companyNoteId }, resource: 'Company-note' });

    company.removeNote(cmd.companyNoteId, userProfile.id);
    await this.companyRepository.save(company);
    return cmd.companyNoteId;
  }

  // ------- QUERIES ------- //

  async findNotesForCompanyById(companyId: CompanyId): Promise<CompanyNoteReadRow[]> {
    return this.companyReadModel.findCompanyNotesByCompanyId(companyId);
  }

  async findCompaniesOverview(query: CompaniesOverviewQuery): Promise<CompaniesOverviewPaginated> {
    return this.companyReadModel.findCompanyOverview(query);
  }
}
