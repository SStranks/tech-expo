/* eslint-disable perfectionist/sort-objects */

import type {
  CompanyContactSummaryDTO,
  CompanyOverviewDTO,
  CompanyPipelineDealSummaryDTO,
  CompanyQuoteSummaryDTO,
} from './companies.read-model.dto.js';
import type { CompanyWithRelations } from './companies.read-model.postgres.js';
import type {
  CompaniesOverviewReadRow,
  CompanyContactSummaryReadRow,
  CompanyPipelineDealSummaryReadRow,
  CompanyQuoteSummaryReadRow,
} from './companies.read-model.types.js';

import { asCompanyId } from '#Models/domain/company/company.mapper.js';
import { asContactId } from '#Models/domain/contact/contact.mapper.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';

export function toCompaniesOverviewRow(data: CompanyWithRelations): CompaniesOverviewReadRow {
  if (!data.salesOwner) throw new Error(`Company ${data.company.id} has no owner`);

  return {
    id: asCompanyId(data.company.id),
    name: data.company.name,
    owner: {
      id: asUserProfileId(data.salesOwner.id),
      firstName: data.salesOwner.firstName,
      lastName: data.salesOwner.lastName,
      image: data.salesOwner.image,
    },
    openDealsAmount: data.openDealsAmount,
    relatedContacts: data.contacts.map((c) => ({
      id: asContactId(c.id),
      firstName: c.firstName,
      lastName: c.lastName,
      image: c.image,
    })),
  };
}

export function toCompaniesOverviewDTO(row: CompaniesOverviewReadRow): CompanyOverviewDTO {
  return {
    id: row.id,
    name: row.name,
    salesOwner: {
      id: row.owner.id,
      firstName: row.owner.firstName,
      lastName: row.owner.lastName,
      image: row.owner.image ? row.owner.image.toString() : '',
    },
    openDealsAmount: {
      id: '',
      amount: row.openDealsAmount,
      currency: '', // TODO:
    },
    relatedContacts: {
      id: `company-${row.id}-contacts`,
      items: row.relatedContacts.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        image: c.image ? c.image.toString() : '',
      })),
      totalCount: row.relatedContacts.length,
    },
  };
}

export const companyDealSummaryRowToDTO = (row: CompanyPipelineDealSummaryReadRow): CompanyPipelineDealSummaryDTO => ({
  id: row.id,
  title: row.title,
  value: row.value,
  stage: row.stageId,
  dealOwner: {
    id: row.dealOwner.id,
    firstName: row.dealOwner.firstName,
    lastName: row.dealOwner.lastName,
  },
  dealContact: {
    id: row.dealContact.id,
    firstName: row.dealContact.firstName,
    lastName: row.dealContact.lastName,
  },
});

export const companyContactSummaryRowToDTO = (row: CompanyContactSummaryReadRow): CompanyContactSummaryDTO => ({
  id: row.id,
  firstName: row.firstName,
  lastName: row.lastName,
  jobTitle: row.jobTitle,
  stage: row.stage,
  image: row.image,
});

export const companyQuoteSummaryRowToDTO = (row: CompanyQuoteSummaryReadRow): CompanyQuoteSummaryDTO => ({
  id: row.id,
  title: row.title,
  totalAmount: {
    id: '',
    amount: row.totalAmount,
    currency: '', // TODO: .
  },
  stage: row.stage,
  preparedBy: {
    id: row.preparedBy.id,
    firstName: row.preparedBy.firstName,
    lastName: row.preparedBy.lastName,
    image: row.preparedBy.image,
  },
  preparedFor: {
    id: row.preparedFor.id,
    firstName: row.preparedFor.firstName,
    lastName: row.preparedFor.lastName,
    image: row.preparedFor.image,
  },
});
