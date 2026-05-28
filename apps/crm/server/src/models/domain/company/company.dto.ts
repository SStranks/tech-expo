import type { CountryId } from '../country/country.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { BusinessType, CompanyId, CompanySize } from './company.types.js';

export type CompanyDTO = {
  id: CompanyId;
  businessType: BusinessType;
  countryId: CountryId;
  industry: string;
  name: string;
  salesOwner: UserProfileId;
  size: CompanySize;
  totalRevenue: string | null;
  website: string | null;
};
