import type { NewCompany, PersistedCompany } from './company.js';
import type { CompanyId } from './company.types.js';

export interface CompanyRepository {
  findCompanyById(id: CompanyId): Promise<PersistedCompany | null>;
  remove(id: CompanyId): Promise<CompanyId>;
  save(company: NewCompany | PersistedCompany): Promise<PersistedCompany>;
}
