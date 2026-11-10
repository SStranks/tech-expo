import type { PipelineDealsTableInsert } from '#Config/schema/pipeline/Deals.ts';
import type { PipelineDealClientGeneratedId } from '#Models/domain/pipeline/deal/deal.types.js';
import type { PipelineStageId } from '#Models/domain/pipeline/stage/stage.types.js';

import type { SeedPipelineCompanies, SeedPipelineUsers } from '../Pipeline.js';
import type { PipelineDealsJSON } from '../types/types.js';

import { createMockUUID, generateOrderKeyBetween } from '@apps/crm-shared/utils';
import { faker } from '@faker-js/faker';

import { importJSONSeed } from '../utils/import.js';

const PipelineDealsJSON = importJSONSeed<PipelineDealsJSON>('PipelineDeals.json');

export type PipelineDealTemplate = (typeof PipelineDealsJSON.deal_title)[number];

type SeedPipelineDealCompanyContacts = SeedPipelineCompanies[number]['contacts'];

const pipelineDealsShuffled = PipelineDealsJSON.deal_title;

export class PipelineDealGenerator {
  private orderKey: string | null = null;

  private readonly companies: SeedPipelineCompanies;
  private readonly pipelineDeals: PipelineDealTemplate[];
  private readonly stageId: PipelineStageId;
  private readonly users: SeedPipelineUsers;

  constructor(stageId: PipelineStageId, allUsers: SeedPipelineUsers, allCompanies: SeedPipelineCompanies) {
    this.companies = allCompanies;
    this.pipelineDeals = pipelineDealsShuffled;
    this.stageId = stageId;
    this.users = allUsers;
  }

  createPipelineDeal(): PipelineDealsTableInsert {
    const dealTitle = this.pipelineDeals.pop();
    if (dealTitle === undefined)
      throw new Error(`Seed data of 'PipelineDeals.deal_title' has been completely consumed`);

    const { contacts, id: companyId } = this.getCompany();

    return {
      clientGeneratedId: this.generateClientId(),
      companyId,
      dealContactId: this.getContactId(contacts),
      dealOwnerUserProfileId: this.generateDealOwnerId(),
      orderKey: this.generateOrderKey(),
      stageId: this.stageId,
      title: dealTitle,
      value: this.generateDealValue(),
    };
  }

  getCompany() {
    return faker.helpers.arrayElement(this.companies);
  }

  getContactId(contacts: SeedPipelineDealCompanyContacts) {
    return faker.helpers.arrayElement(contacts).id;
  }

  generateDealValue() {
    return faker.commerce.price({ dec: 2, max: 10_000, min: 100 });
  }

  generateDealOwnerId() {
    return faker.helpers.arrayElement(this.users).id;
  }

  generateClientId() {
    return createMockUUID() as PipelineDealClientGeneratedId;
  }

  generateOrderKey(): string {
    this.orderKey = generateOrderKeyBetween(this.orderKey, null);
    return this.orderKey;
  }
}
