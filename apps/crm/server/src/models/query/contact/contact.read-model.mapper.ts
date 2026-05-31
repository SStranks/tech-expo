import type { ContactOverviewDTO } from './contact.read-model.dto.js';
import type { ContactWithRelations } from './contacts.read-model.postgres.js';
import type { ContactOverviewReadRow } from './contacts.read-model.types.js';

export function contactWithRelationsToOverviewRow(data: ContactWithRelations): ContactOverviewReadRow {
  return {
    id: data.contact.id,
    company: {
      id: data.company.id,
      businessType: data.company.businessType,
      clientGeneratedId: data.company.clientGeneratedId,
      countryId: data.company.countryId,
      industry: data.company.industry,
      name: data.company.name,
      salesOwner: data.company.salesOwner,
      size: data.company.size,
      totalRevenue: data.company.totalRevenue,
      website: data.company.website,
    },
    email: data.contact.email,
    firstName: data.contact.firstName,
    jobTitle: data.contact.jobTitle,
    lastName: data.contact.lastName,
    stage: data.contact.stage,
  };
}

export function contactOverviewRowToContactOverviewDTO(row: ContactOverviewReadRow): ContactOverviewDTO {
  return {
    id: row.id,
    company: row.company,
    email: row.email,
    firstName: row.firstName,
    jobTitle: row.jobTitle,
    lastName: row.lastName,
    stage: row.stage,
  };
}
