import type { NewCompany, PersistedCompany } from './company.js';
import type { CompanyId } from './company.types.js';

export interface CompanyRepository {
  save(company: NewCompany | PersistedCompany): Promise<PersistedCompany>;
  remove(id: CompanyId): Promise<CompanyId>;
  findCompanyById(id: CompanyId): Promise<PersistedCompany | null>;
}
