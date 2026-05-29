import type { CompanyRepository } from '#Models/domain/company/company.repository.js';
import type { ContactRepository } from '#Models/domain/contact/contact.repository.js';
import type { QuoteNoteId } from '#Models/domain/quote/note/note.types.js';
import type { PersistedQuote } from '#Models/domain/quote/quote.js';
import type { QuoteRepository } from '#Models/domain/quote/quote.repository.js';
import type {
  AddQuoteNoteCommand,
  AddQuoteNoteReturn,
  AddQuoteServiceCommand,
  AddQuoteServiceReturn,
  CreateQuoteCommand,
  QuoteId,
  RemoveQuoteNoteCommand,
  RemoveQuoteServiceCommand,
  UpdateQuoteCommand,
  UpdateQuoteNoteCommand,
  UpdateQuoteNoteReturn,
  UpdateQuoteServiceCommand,
  UpdateQuoteServiceReturn,
} from '#Models/domain/quote/quote.types.js';
import type { QuoteServiceId } from '#Models/domain/quote/service/service.types.js';
import type { UserRepository } from '#Models/domain/user/user.repository.js';
import type {
  PaginatedCompanyQuotes,
  PaginatedCompanyQuotesQuery,
} from '#Models/query/company/companies.read-model.types.js';
import type { QuoteReadModel } from '#Models/query/quote/quotes.read-model.js';
import type {
  QuoteNoteReadRow,
  QuoteServiceReadRow,
  QuotesOverviewPaginated,
  QuotesOverviewQuery,
} from '#Models/query/quote/quotes.read-model.types.js';
import type { UserReadModel } from '#Models/query/user/users.read-model.js';
import type { RequestContext } from '#Types/request-context.js';

import { Quote } from '#Models/domain/quote/quote.js';
import { NotFoundError } from '#Utils/errors/NotFoundError.js';

interface QuoteServiceDependencies {
  companyRepository: CompanyRepository;
  contactRepository: ContactRepository;
  quoteReadModel: QuoteReadModel;
  quoteRepository: QuoteRepository;
  userReadModel: UserReadModel;
  userRepository: UserRepository;
}

interface IQuoteService {
  addQuoteNote(cmd: AddQuoteNoteCommand, ctx: RequestContext): Promise<AddQuoteNoteReturn>;
  addQuoteService(cmd: AddQuoteServiceCommand, ctx: RequestContext): Promise<AddQuoteServiceReturn>;
  createQuote(cmd: CreateQuoteCommand): Promise<PersistedQuote>;
  findPaginatedQuotesForCompany(query: PaginatedCompanyQuotesQuery): Promise<PaginatedCompanyQuotes>;
  findQuoteNoteByQuoteId(id: QuoteId): Promise<QuoteNoteReadRow | null>;
  findQuoteServicesByQuoteId(id: QuoteId): Promise<QuoteServiceReadRow[]>;
  findQuotesOverview(query: QuotesOverviewQuery): Promise<QuotesOverviewPaginated>;
  getQuoteById(id: QuoteId): Promise<PersistedQuote>;
  removeQuoteById(id: QuoteId): Promise<QuoteId>;
  removeQuoteNote(cmd: RemoveQuoteNoteCommand, ctx: RequestContext): Promise<QuoteNoteId>;
  removeQuoteService(cmd: RemoveQuoteServiceCommand, ctx: RequestContext): Promise<QuoteServiceId>;
  updateQuoteById(cmd: UpdateQuoteCommand): Promise<PersistedQuote>;
  updateQuoteNote(cmd: UpdateQuoteNoteCommand, ctx: RequestContext): Promise<UpdateQuoteNoteReturn>;
  updateQuoteService(cmd: UpdateQuoteServiceCommand, ctx: RequestContext): Promise<UpdateQuoteServiceReturn>;
}

export class QuoteService implements IQuoteService {
  private readonly companyRepository: CompanyRepository;
  private readonly contactRepository: ContactRepository;
  private readonly quoteRepository: QuoteRepository;
  private readonly quoteReadModel: QuoteReadModel;
  private readonly userReadModel: UserReadModel;
  private readonly userRepository: UserRepository;

  constructor({
    companyRepository,
    contactRepository,
    quoteReadModel,
    quoteRepository,
    userReadModel,
    userRepository,
  }: QuoteServiceDependencies) {
    this.companyRepository = companyRepository;
    this.contactRepository = contactRepository;
    this.quoteReadModel = quoteReadModel;
    this.quoteRepository = quoteRepository;
    this.userReadModel = userReadModel;
    this.userRepository = userRepository;
  }

  // ------- COMMANDs ------ //

  async getQuoteById(id: QuoteId): Promise<PersistedQuote> {
    const quote = await this.quoteRepository.findQuoteById(id);

    if (!quote) throw new NotFoundError({ context: { quoteId: id }, resource: 'Quote' });

    return quote;
  }

  async createQuote(cmd: CreateQuoteCommand): Promise<PersistedQuote> {
    const newQuote = Quote.create({ ...cmd });

    return this.quoteRepository.save(newQuote);
  }

  async updateQuoteById(cmd: UpdateQuoteCommand): Promise<PersistedQuote> {
    const quote = await this.getQuoteById(cmd.id);

    if (cmd.companyId !== undefined && cmd.companyId !== quote.companyId) {
      const company = await this.companyRepository.findCompanyById(cmd.companyId);
      if (!company) throw new NotFoundError({ context: { companyId: cmd.companyId }, resource: 'Company' });
    }

    if (cmd.preparedByUserProfileId !== undefined && cmd.preparedByUserProfileId !== quote.preparedByUserProfileId) {
      const userProfile = await this.userRepository.findUserProfileById(cmd.preparedByUserProfileId);
      if (!userProfile)
        throw new NotFoundError({ context: { companyId: cmd.preparedByUserProfileId }, resource: 'UserProfile' });
    }

    if (cmd.preparedForContactId !== undefined && cmd.preparedForContactId !== quote.preparedForContactId) {
      const contact = await this.contactRepository.findContactById(cmd.preparedForContactId);
      if (!contact)
        throw new NotFoundError({ context: { preparedForContactId: cmd.preparedForContactId }, resource: 'Contact' });
    }

    quote.updateProfile(cmd);

    return this.quoteRepository.save(quote);
  }

  async removeQuoteById(id: QuoteId): Promise<QuoteId> {
    return this.quoteRepository.remove(id);
  }

  async addQuoteService(cmd: AddQuoteServiceCommand, ctx: RequestContext): Promise<AddQuoteServiceReturn> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const quote = await this.getQuoteById(cmd.quoteId);

    // TODO: Currency thing.
    const { clientGeneratedId } = quote.addService({
      clientGeneratedId: cmd.clientGeneratedId,
      discount: cmd.discount,
      price: cmd.price.amount,
      quantity: cmd.quantity,
      quoteId: cmd.quoteId,
      title: cmd.title,
      totalAmount: cmd.totalAmount.amount,
    });

    await this.quoteRepository.save(quote);
    const quoteService = quote.getServiceByClientGeneratedId(clientGeneratedId);

    return { quote, quoteService };
  }

  updateQuoteService(_cmd: UpdateQuoteServiceCommand, _ctx: RequestContext): Promise<UpdateQuoteServiceReturn> {
    throw new Error('Not yet implemented');
  }

  async removeQuoteService(cmd: RemoveQuoteServiceCommand, ctx: RequestContext): Promise<QuoteServiceId> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const quote = await this.getQuoteById(cmd.quoteId);
    const quoteService = await this.quoteReadModel.findQuoteServiceByQuoteServiceId(cmd.quoteServiceId);

    if (!quoteService)
      throw new NotFoundError({ context: { quoteServiceId: cmd.quoteServiceId }, resource: 'Quote-service' });

    quote.removeService(cmd.quoteServiceId, userProfile.id);
    await this.quoteRepository.save(quote);
    return cmd.quoteServiceId;
  }

  async addQuoteNote(cmd: AddQuoteNoteCommand, ctx: RequestContext): Promise<AddQuoteNoteReturn> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const quote = await this.getQuoteById(cmd.quoteId);

    const { clientGeneratedId } = quote.addNote({ ...cmd });

    await this.quoteRepository.save(quote);
    const quoteNote = quote.getNoteByClientGeneratedId(clientGeneratedId);

    return { quote, quoteNote };
  }

  updateQuoteNote(_cmd: UpdateQuoteNoteCommand, _ctx: RequestContext): Promise<UpdateQuoteNoteReturn> {
    throw new Error('Not yet implemented');
  }

  async removeQuoteNote(cmd: RemoveQuoteNoteCommand, ctx: RequestContext): Promise<QuoteNoteId> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: `Userprofile by UserId` });

    const quote = await this.getQuoteById(cmd.quoteId);
    const quoteNote = await this.quoteReadModel.findQuoteNoteByQuoteId(cmd.quoteId);

    if (!quoteNote) throw new NotFoundError({ context: { quoteNoteId: cmd.quoteNoteId }, resource: 'Quote-note' });

    quote.removeNote(cmd.quoteNoteId, userProfile.id);
    await this.quoteRepository.save(quote);
    return cmd.quoteNoteId;
  }

  // ------- QUERIES ------- //

  findQuoteNoteByQuoteId(quoteId: QuoteId): Promise<QuoteNoteReadRow | null> {
    return this.quoteReadModel.findQuoteNoteByQuoteId(quoteId);
  }

  findQuoteServicesByQuoteId(quoteId: QuoteId): Promise<QuoteServiceReadRow[]> {
    return this.quoteReadModel.findQuoteServicesByQuoteId(quoteId);
  }

  findPaginatedQuotesForCompany(query: PaginatedCompanyQuotesQuery): Promise<PaginatedCompanyQuotes> {
    return this.quoteReadModel.findQuotesByCompanyId(query);
  }

  findQuotesOverview(query: QuotesOverviewQuery): Promise<QuotesOverviewPaginated> {
    return this.quoteReadModel.findQuotesOverview(query);
  }
}
