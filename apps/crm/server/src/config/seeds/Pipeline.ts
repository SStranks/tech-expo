import type { PostgresClient } from '#Config/dbPostgres.js';
import type { PipelineDealsTableInsert } from '#Config/schema/pipeline/Deals.ts';
import type { PipelineTableInsert } from '#Config/schema/pipeline/Pipeline.ts';
import type { PipelineStagesTableInsert } from '#Config/schema/pipeline/Stages.ts';

import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import CompaniesTable from '#Config/schema/companies/Companies.js';
import PipelineDealsTable from '#Config/schema/pipeline/Deals.js';
import PipelineTable from '#Config/schema/pipeline/Pipeline.js';
import PipelineStagesTable from '#Config/schema/pipeline/Stages.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generatePipelineDeal } from './generators/PipelineDeal.js';
export type SeedPipelineDealStages = typeof PIPELINE_DEAL_STAGES;
export type SeedPipelineCompanies = Awaited<ReturnType<typeof getAllCompaniesWithContacts>>;
export type SeedPipelineUsers = Awaited<ReturnType<typeof getAllUsers>>;

const { COMPANY_NAME, PIPELINE_STAGE_DEALS_MAX, PIPELINE_STAGE_DEALS_MIN } = seedSettings;

const PIPELINE_DEAL_STAGES = ['unassigned', 'won', 'lost', 'new', 'follow-up', 'under review'] as const;

const getPrimaryCompany = async (db: PostgresClient) => {
  return db.query.CompaniesTable.findFirst({
    columns: { id: true },
    where: eq(CompaniesTable.name, COMPANY_NAME),
  });
};

const getAllUsers = async (db: PostgresClient) => {
  return db.query.UserProfileTable.findMany({});
};

const getAllCompaniesWithContacts = async (db: PostgresClient) => {
  return db.query.CompaniesTable.findMany({ with: { contacts: { columns: { id: true } } } });
};

export default async function seedPipeline(db: PostgresClient) {
  const primaryCompany = await getPrimaryCompany(db);
  if (!primaryCompany) throw new Error(`Could not source ${COMPANY_NAME} from company table`);

  // ---------------- PIPELINE TABLE --------------- //
  const pipelineInsertionData: PipelineTableInsert[] = [];
  // eslint-disable-next-line unicorn/no-immediate-mutation
  pipelineInsertionData.push({ companyId: primaryCompany.id });

  const pipelineTableReturnData = await db
    .insert(PipelineTable)
    .values(pipelineInsertionData)
    .returning({ pipelineId: PipelineTable.id });

  const PRIMARY_COMPANY_PIPELINE_ID = pipelineTableReturnData[0].pipelineId;

  // ------------- PIPELINE-STAGES TABLE ------------ //
  const pipelineStagesInsertionData: PipelineStagesTableInsert[] = [];

  PIPELINE_DEAL_STAGES.forEach((title) => {
    pipelineStagesInsertionData.push({ pipelineId: PRIMARY_COMPANY_PIPELINE_ID, title });
  });

  const stagesReturnData = await db
    .insert(PipelineStagesTable)
    .values(pipelineStagesInsertionData)
    .returning({ id: PipelineStagesTable.id });

  // ------------- PIPELINE-DEALS TABLE ------------ //
  const pipelineDealsInsertionData: PipelineDealsTableInsert[] = [];
  const allUsers = await getAllUsers(db);
  const allCompanies = await getAllCompaniesWithContacts(db);
  if (allUsers.length === 0 || allCompanies.length === 0) throw new Error(`Could not source users or companies`);

  stagesReturnData.forEach(({ id: stageId }) => {
    const randNumOfDeals = faker.number.int({ max: PIPELINE_STAGE_DEALS_MAX, min: PIPELINE_STAGE_DEALS_MIN });

    for (let i = 0; i < randNumOfDeals; i++) {
      pipelineDealsInsertionData.push(generatePipelineDeal(allCompanies, allUsers, stageId));
    }
  });

  await db.insert(PipelineDealsTable).values(pipelineDealsInsertionData).returning();

  // ------------- PIPELINE-DEALS-ORDER TABLE ------------ //
  // NOTE: Depreciated; WIP on Lexicographical ordering on task/card itself
  // const pipelineDealsOrderInsertionData: TPipelineDealsOrderTableInsert[] = [];

  // stagesReturnData.forEach(({ id: columnId }) => {
  //   const dealOrder = dealsReturnData.filter((deal) => deal.stage === columnId).map((deal) => deal.serial);
  //   pipelineDealsOrderInsertionData.push({ columnId, dealOrder, pipelineId: PRIMARY_COMPANY_PIPELINE_ID });
  // });

  // await db.insert(PipelineDealsOrderTable).values(pipelineDealsOrderInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Pipeline.ts');
}
