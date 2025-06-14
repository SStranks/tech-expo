import type { UUID } from 'node:crypto';

import type { TCompanyDTO, TCompanyDTOWithCountry } from './Company.js';

export interface ICompanyRepository {
  findAll(): Promise<TCompanyDTO[]>;
  findAllWithCountry(): Promise<TCompanyDTOWithCountry[]>;
  findById(id: UUID): Promise<TCompanyDTO | null>;
  findByIdWithCountry(id: UUID): Promise<TCompanyDTOWithCountry | null>;
}
