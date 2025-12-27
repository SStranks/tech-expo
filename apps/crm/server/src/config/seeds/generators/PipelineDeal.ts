import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { PipelineDealsTableInsert } from '#Config/schema/index.js';

import type { SeedPipelineCompanies, SeedPipelineUsers } from '../Pipeline.js';

import { faker } from '@faker-js/faker';

import PipelineDealsTitles from '#Data/PipelineDeals.json';

// TODO:  Possibility of duplicate task from faker.arrayElement calls; amend to ensure unique random value
export function generatePipelineDeal(
  companies: SeedPipelineCompanies,
  users: SeedPipelineUsers,
  stage: UUID
): PipelineDealsTableInsert {
  const title = faker.helpers.arrayElement(PipelineDealsTitles.deal_title);
  const dealOwner = faker.helpers.arrayElement(users).id;
  const value = faker.commerce.price({ dec: 2, max: 10_000, min: 100 });
  const { contacts, id: company } = faker.helpers.arrayElement(companies);
  const { id: dealContact } = faker.helpers.arrayElement(contacts);
  const orderKey = ''; // TODO: Needs to be lexicographically generated

  return {
    company,
    dealContact,
    dealOwner,
    orderKey,
    stage,
    title,
    value,
  };
}
