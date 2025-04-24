import type { TPostgresDB } from '#Config/dbPostgres.js';
import type {
  TPipelineDealsOrderTableInsert,
  TPipelineDealsTableInsert,
  TPipelineStagesTableInsert,
  TPipelineTableInsert,
} from '#Config/schema/index.js';

import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import {
  CompaniesTable,
  PipelineDealsOrderTable,
  PipelineDealsTable,
  PipelineStagesTable,
  PipelineTable,
} from '#Config/schema/index.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generatePipelineDeal } from './generators/PipelineDeal.js';
export type TSeedPipelineDealStages = typeof PIPELINE_DEAL_STAGES;
export type TSeedPipelineCompanies = Awaited<ReturnType<typeof getAllCompaniesWithContacts>>;
export type TSeedPipelineUsers = Awaited<ReturnType<typeof getAllUsers>>;

const { COMPANY_NAME, PIPELINE_STAGE_DEALS_MAX, PIPELINE_STAGE_DEALS_MIN } = seedSettings;

const PIPELINE_DEAL_STAGES = ['unassigned', 'won', 'lost', 'new', 'follow-up', 'under review'] as const;

const getPrimaryCompany = async (db: TPostgresDB) => {
  return await db.query.CompaniesTable.findFirst({
    columns: { id: true },
    where: eq(CompaniesTable.companyName, COMPANY_NAME),
  });
};

const getAllUsers = async (db: TPostgresDB) => {
  return await db.query.UserProfileTable.findMany({});
};

const getAllCompaniesWithContacts = async (db: TPostgresDB) => {
  return await db.query.CompaniesTable.findMany({ with: { contacts: { columns: { id: true } } } });
};

export default async function seedPipeline(db: TPostgresDB) {
  const primaryCompany = await getPrimaryCompany(db);
  if (!primaryCompany) throw new Error(`Could not source ${COMPANY_NAME} from company table`);

  // ---------------- PIPELINE TABLE --------------- //
  const pipelineInsertionData: TPipelineTableInsert[] = [];
  pipelineInsertionData.push({ companyId: primaryCompany.id });

  const pipelineTableReturnData = await db
    .insert(PipelineTable)
    .values(pipelineInsertionData)
    .returning({ pipelineId: PipelineTable.id });

  const PRIMARY_COMPANY_PIPELINE_ID = pipelineTableReturnData[0].pipelineId;

  // ------------- PIPELINE-STAGES TABLE ------------ //
  const pipelineStagesInsertionData: TPipelineStagesTableInsert[] = [];

  PIPELINE_DEAL_STAGES.forEach((title) => {
    pipelineStagesInsertionData.push({ pipelineTableId: PRIMARY_COMPANY_PIPELINE_ID, title });
  });

  const stagesReturnData = await db
    .insert(PipelineStagesTable)
    .values(pipelineStagesInsertionData)
    .returning({ id: PipelineStagesTable.id });

  // ------------- PIPELINE-DEALS TABLE ------------ //
  const pipelineDealsInsertionData: TPipelineDealsTableInsert[] = [];
  const allUsers = await getAllUsers(db);
  const allCompanies = await getAllCompaniesWithContacts(db);
  if (!allUsers || !allCompanies)
    throw new Error(
      `Could not source users or companies. Users: ${allUsers?.length}. Companies: ${allCompanies?.length}`
    );

  stagesReturnData.forEach(({ id: stageId }) => {
    const randNumOfDeals = faker.number.int({ max: PIPELINE_STAGE_DEALS_MAX, min: PIPELINE_STAGE_DEALS_MIN });

    for (let i = 0; i < randNumOfDeals; i++) {
      pipelineDealsInsertionData.push(generatePipelineDeal(allCompanies, allUsers, stageId));
    }
  });

  const dealsReturnData = await db.insert(PipelineDealsTable).values(pipelineDealsInsertionData).returning();

  // ------------- PIPELINE-DEALS-ORDER TABLE ------------ //
  const pipelineDealsOrderInsertionData: TPipelineDealsOrderTableInsert[] = [];

  stagesReturnData.forEach(({ id: columnId }) => {
    const dealOrder = dealsReturnData.filter((deal) => deal.stage === columnId).map((deal) => deal.serial);
    pipelineDealsOrderInsertionData.push({ columnId, dealOrder, pipelineId: PRIMARY_COMPANY_PIPELINE_ID });
  });

  await db.insert(PipelineDealsOrderTable).values(pipelineDealsOrderInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Pipeline.ts');
}
