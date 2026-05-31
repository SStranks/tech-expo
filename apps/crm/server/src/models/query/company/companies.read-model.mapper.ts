import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';

import type {
  CompanyContactSummaryDTO,
  CompanyOverviewDTO,
  CompanyPipelineDealSummaryDTO,
  CompanyQuoteSummaryDTO,
} from './companies.read-model.dto.js';
import type { CompanyWithRelations } from './companies.read-model.postgres.js';
import type {
  CompanyContactSummaryReadRow,
  CompanyOverviewReadRow,
  CompanyPipelineDealSummaryReadRow,
  CompanyQuoteSummaryReadRow,
  CompanyReadRow,
} from './companies.read-model.types.js';

export function companyWithRelationsToOverviewRow(data: CompanyWithRelations): CompanyOverviewReadRow {
  if (!data.salesOwner) throw new Error(`Company ${data.company.id} has no owner`);

  return {
    id: data.company.id,
    name: data.company.name,
    openDealsAmount: data.openDealsAmount,
    owner: {
      id: data.salesOwner.id,
      firstName: data.salesOwner.firstName,
      image: data.salesOwner.image,
      lastName: data.salesOwner.lastName,
    },
    relatedContacts: data.contacts.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      image: c.image,
      lastName: c.lastName,
    })),
  };
}

export function companyOverviewRowToCompanyOverviewDTO(row: CompanyOverviewReadRow): CompanyOverviewDTO {
  return {
    id: row.id,
    name: row.name,
    openDealsAmount: {
      id: '',
      amount: row.openDealsAmount,
      currency: '', // TODO: Currency
    },
    relatedContacts: {
      id: `company-${row.id}-contacts`,
      items: row.relatedContacts.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        image: c.image ? c.image.toString() : '',
        lastName: c.lastName,
      })),
      totalCount: row.relatedContacts.length,
    },
    salesOwner: {
      id: row.owner.id,
      firstName: row.owner.firstName,
      image: row.owner.image ? row.owner.image.toString() : '',
      lastName: row.owner.lastName,
    },
  };
}

export function companyDealSummaryRowToCompanyDealSummaryDTO(
  row: CompanyPipelineDealSummaryReadRow
): CompanyPipelineDealSummaryDTO {
  return {
    id: row.id,
    dealContact: {
      id: row.dealContact.id,
      firstName: row.dealContact.firstName,
      lastName: row.dealContact.lastName,
    },
    dealOwner: {
      id: row.dealOwner.id,
      firstName: row.dealOwner.firstName,
      lastName: row.dealOwner.lastName,
    },
    stage: row.stageId,
    title: row.title,
    value: row.value,
  };
}

export function companyContactSummaryRowToCompanyContactSummaryDTO(
  row: CompanyContactSummaryReadRow
): CompanyContactSummaryDTO {
  return {
    id: row.id,
    firstName: row.firstName,
    image: row.image,
    jobTitle: row.jobTitle,
    lastName: row.lastName,
    stage: row.stage,
  };
}

export function companyQuoteSummaryRowToCompanyQuoteSummaryDTO(
  row: CompanyQuoteSummaryReadRow
): CompanyQuoteSummaryDTO {
  return {
    id: row.id,
    preparedBy: {
      id: row.preparedBy.id,
      firstName: row.preparedBy.firstName,
      image: row.preparedBy.image,
      lastName: row.preparedBy.lastName,
    },
    preparedFor: {
      id: row.preparedFor.id,
      firstName: row.preparedFor.firstName,
      image: row.preparedFor.image,
      lastName: row.preparedFor.lastName,
    },
    stage: row.stage,
    title: row.title,
    totalAmount: {
      id: '',
      amount: row.totalAmount,
      currency: '', // TODO: .
    },
  };
}

export function companyRowToReadRow(row: CompaniesTableSelect): CompanyReadRow {
  return {
    id: row.id,
    businessType: row.businessType,
    clientGeneratedId: row.clientGeneratedId,
    countryId: row.countryId,
    industry: row.industry,
    name: row.name,
    salesOwner: row.salesOwner,
    size: row.size,
    totalRevenue: row.totalRevenue,
    website: row.website,
  };
}
