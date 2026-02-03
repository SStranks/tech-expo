import type { UUID } from '@apps/crm-shared';

import type { PipelineDealsTableInsert } from '#Config/schema/pipeline/Deals.ts';

import type { SeedPipelineCompanies, SeedPipelineUsers } from '../Pipeline.js';

import { faker } from '@faker-js/faker';

import PipelineDealsTitles from '#Data/PipelineDeals.json';

// TODO:  Possibility of duplicate task from faker.arrayElement calls; amend to ensure unique random value
export function generatePipelineDeal(
  companies: SeedPipelineCompanies,
  users: SeedPipelineUsers,
  stageId: UUID
): PipelineDealsTableInsert {
  const title = faker.helpers.arrayElement(PipelineDealsTitles.deal_title);
  const dealOwnerUserProfileId = faker.helpers.arrayElement(users).id;
  const value = faker.commerce.price({ dec: 2, max: 10_000, min: 100 });
  const { contacts, id: companyId } = faker.helpers.arrayElement(companies);
  const { id: dealContactId } = faker.helpers.arrayElement(contacts);
  const orderKey = ''; // TODO: Needs to be lexicographically generated

  return {
    companyId,
    dealContactId,
    dealOwnerUserProfileId,
    orderKey,
    stageId,
    title,
    value,
  };
}
