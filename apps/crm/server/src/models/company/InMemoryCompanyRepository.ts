import type { TCompanyDTO } from './Company.js';
import type { ICompanyRepository } from './CompanyRepository.js';

export class InMemoryCompanyRepository implements ICompanyRepository {
  private companies: TCompanyDTO[] = [];

  async findAll(): Promise<TCompanyDTO[]> {
    return [...this.companies];
  }
}
