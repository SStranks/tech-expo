import type { CountryId } from '../country/country.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { BusinessType, CompanyId, CompanySize } from './company.types.js';

export type CompanyDTO = {
  id: CompanyId;
  name: string;
  size: CompanySize;
  totalRevenue: string | null;
  industry: string;
  businessType: BusinessType;
  countryId: CountryId;
  website: string | null;
  salesOwner: UserProfileId;
};
