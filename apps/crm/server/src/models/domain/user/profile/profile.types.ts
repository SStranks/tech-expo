import type { UUID } from '@apps/crm-shared';

export type CompanyRoles = (typeof COMPANY_ROLES)[number];
export const COMPANY_ROLES = ['ADMIN', 'SALES_MANAGER', 'SALES_PERSON', 'SALES_INTERN'] as const;

export type UserProfileId = UUID & { readonly __userProfileId: unique symbol };
