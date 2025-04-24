import type { UUID } from 'node:crypto';

import type { TPipelineDealsTableInsert } from '#Config/schema/index.js';

import type { TSeedPipelineCompanies, TSeedPipelineUsers } from '../Pipeline.js';

import { faker } from '@faker-js/faker';

import PipelineDealsTitles from '#Data/PipelineDeals.json';

// TODO:  Possibility of duplicate task from faker.arrayElement calls; amend to ensure unique random value
export function generatePipelineDeal(
  companies: TSeedPipelineCompanies,
  users: TSeedPipelineUsers,
  stage: UUID
): TPipelineDealsTableInsert {
  const title = faker.helpers.arrayElement(PipelineDealsTitles.deal_title);
  const dealOwner = faker.helpers.arrayElement(users).id;
  const value = faker.commerce.price({ dec: 2, max: 10_000, min: 100 });
  const { contacts, id: company } = faker.helpers.arrayElement(companies);
  const { id: dealContact } = faker.helpers.arrayElement(contacts);

  return {
    company,
    dealContact,
    dealOwner,
    stage,
    title,
    value,
  };
}
