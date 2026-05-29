/* eslint-disable perfectionist/sort-objects */
import type { ContactOverviewDTO } from './contact.read-model.dto.js';
import type { ContactWithRelations } from './contacts.read-model.postgres.js';
import type { ContactOverviewReadRow } from './contacts.read-model.types.js';

export function contactWithRelationsToOverviewRow(data: ContactWithRelations): ContactOverviewReadRow {
  return {
    id: data.contact.id,
    firstName: data.contact.firstName,
    lastName: data.contact.lastName,
    email: data.contact.email,
    jobTitle: data.contact.jobTitle,
    stage: data.contact.stage,
    company: {
      id: data.company.id,
      name: data.company.name,
      size: data.company.size,
      totalRevenue: data.company.totalRevenue,
      industry: data.company.industry,
      businessType: data.company.businessType,
      countryId: data.company.countryId,
      website: data.company.website,
      salesOwner: data.company.salesOwner,
    },
  };
}

export function contactOverviewRowToContactOverviewDTO(row: ContactOverviewReadRow): ContactOverviewDTO {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    jobTitle: row.jobTitle,
    stage: row.stage,
    company: row.company,
  };
}
