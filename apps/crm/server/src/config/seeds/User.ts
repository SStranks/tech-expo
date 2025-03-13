import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TUserProfileTableInsert, TUserTableInsert } from '#Config/schema/index.js';

import { eq } from 'drizzle-orm';

import { CompaniesTable, UserProfileTable, UserTable } from '#Config/schema/index.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateDemoUsers, generateUsers } from './generators/Users.js';

const { COMPANY_NAME } = seedSettings;

// The primary company is the one utilizing the application
async function getPrimaryCompany(db: TPostgresDB) {
  return await db.query.CompaniesTable.findFirst({
    where: eq(CompaniesTable.companyName, COMPANY_NAME),
    with: { country: { with: { timezone: { columns: { id: true } } } } },
  });
}

// TODO:  Make JSON file with UserProfile image addresses; URL should then be MD5 hashed here.
export default async function seedUsers(db: TPostgresDB) {
  const primaryCompany = await getPrimaryCompany(db);
  if (!primaryCompany) throw new Error(`Could not find primary company ${COMPANY_NAME}`);

  // -------------- USER TABLE ------------- //
  const userInsertionData: TUserTableInsert[] = [];
  const demoUserInsertionData: TUserTableInsert[] = [];

  const generatedUsers = generateUsers();
  const generatedDemoUsers = generateDemoUsers();

  generatedUsers.forEach((user) => {
    userInsertionData.push({
      id: user.userId,
      email: user.personalEmail,
      password: user.hashedPassword,
      role: 'USER',
    });
  });

  generatedDemoUsers.forEach((user) => {
    demoUserInsertionData.push({
      id: user.userId,
      email: user.personalEmail,
      password: user.hashedPassword,
      role: user.userRole,
    });
  });

  await db.insert(UserTable).values(userInsertionData);
  await db.insert(UserTable).values(demoUserInsertionData);

  // ---------- USER-PROFILE TABLE --------- //
  const userProfileInsertionData: TUserProfileTableInsert[] = [];
  const demoUserProfileInsertionData: TUserProfileTableInsert[] = [];

  generatedUsers.forEach((user) => {
    userProfileInsertionData.push({
      company: primaryCompany.id,
      companyRole: user.companyRole,
      country: primaryCompany.country.id,
      email: user.companyEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      telephone: user.telephone,
      timezone: primaryCompany.country.timezone[0].id,
      userId: user.userId,
    });
  });

  generatedDemoUsers.forEach((user) => {
    demoUserProfileInsertionData.push({
      company: primaryCompany.id,
      companyRole: user.companyRole,
      country: primaryCompany.country.id,
      email: user.companyEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      telephone: user.telephone,
      timezone: primaryCompany.country.timezone[0].id,
      userId: user.userId,
    });
  });

  await db.insert(UserProfileTable).values(demoUserProfileInsertionData);
  await db.insert(UserProfileTable).values(userProfileInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Users.ts, UserProfile.ts');
}
