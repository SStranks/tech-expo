import type { QuoteRepository } from '#Models/domain/quote/quote.repository.js';
import type {
  PaginatedCompanyQuotes,
  PaginatedCompanyQuotesQuery,
} from '#Models/query/company/companies.read-model.types.js';
import type { QuoteReadModel } from '#Models/query/quote/quotes.read-model.js';

interface QuoteServiceDependencies {
  quoteRepository: QuoteRepository;
  quoteReadModel: QuoteReadModel;
}

interface IQuoteService {
  getPaginatedQuotesForCompany(query: PaginatedCompanyQuotesQuery): Promise<PaginatedCompanyQuotes>;
}

export class QuoteService implements IQuoteService {
  private readonly quoteRepository: QuoteRepository;
  private readonly quoteReadModel: QuoteReadModel;

  constructor({ quoteReadModel, quoteRepository }: QuoteServiceDependencies) {
    this.quoteReadModel = quoteReadModel;
    this.quoteRepository = quoteRepository;
  }

  // ------- COMMANDs ------ //
  // ------- QUERIES ------- //

  getPaginatedQuotesForCompany(_query: PaginatedCompanyQuotesQuery): Promise<PaginatedCompanyQuotes> {
    throw new Error('Method not implemented.');
  }
}
