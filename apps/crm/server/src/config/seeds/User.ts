/* eslint-disable security/detect-object-injection */
import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TUserProfileTableInsert, TUserTableInsert } from '#Config/schema/index.js';

import { eq } from 'drizzle-orm';

import { CompaniesTable, UserProfileTable, UserTable } from '#Config/schema/index.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateDemoUsers, generateUsers } from './generators/Users.js';

const { COMPANY_NAME, USER_ENTRY_COUNT } = seedSettings;

// TODO:  Make JSON file with UserProfile image addresses; URL should then be MD5 hashed here.
export default async function seedUsers(db: TPostgresDB) {
  const USERS_ARRAY = generateUsers();
  const USERS_DEMO_ARRAY = generateDemoUsers();

  // Establish primary company utilizing our CRM application
  const COMPANY = await db.query.CompaniesTable.findFirst({
    where: eq(CompaniesTable.companyName, COMPANY_NAME),
    with: { country: { with: { timezone: { columns: { id: true } } } } },
  });
  if (!COMPANY) throw new Error(`Error: Could not find company ${COMPANY_NAME}.`);

  // -------------- USER ------------- //
  const userData: TUserTableInsert[] = Array.from({ length: USER_ENTRY_COUNT }, (_, i) => {
    return {
      id: USERS_ARRAY[i].userId,
      email: USERS_ARRAY[i].personalEmail,
      password: USERS_ARRAY[i].hashedPassword,
      role: 'USER',
    };
  });

  await db.insert(UserTable).values(userData);

  const demoUserData: TUserTableInsert[] = Array.from({ length: 3 }, (_, i) => {
    return {
      id: USERS_DEMO_ARRAY[i].userId,
      email: USERS_DEMO_ARRAY[i].personalEmail,
      password: USERS_DEMO_ARRAY[i].hashedPassword,
      role: USERS_DEMO_ARRAY[i].userRole,
    };
  });

  await db.insert(UserTable).values(demoUserData);

  // ---------- USER-PROFILE --------- //
  const userProfileData: TUserProfileTableInsert[] = Array.from({ length: USER_ENTRY_COUNT }, (_, i) => ({
    company: COMPANY.id,
    companyRole: USERS_ARRAY[i].companyRole,
    country: COMPANY.country.id,
    email: USERS_ARRAY[i].companyEmail,
    firstName: USERS_ARRAY[i].firstName,
    lastName: USERS_ARRAY[i].lastName,
    mobile: USERS_ARRAY[i].mobile,
    telephone: USERS_ARRAY[i].telephone,
    timezone: COMPANY.country.timezone[0].id,
    userId: USERS_ARRAY[i].userId,
  }));

  await db.insert(UserProfileTable).values(userProfileData);

  const demoUserProfileData: TUserProfileTableInsert[] = Array.from({ length: USERS_DEMO_ARRAY.length }, (_, i) => ({
    company: COMPANY.id,
    companyRole: USERS_DEMO_ARRAY[i].companyRole,
    country: COMPANY.country.id,
    email: USERS_DEMO_ARRAY[i].companyEmail,
    firstName: USERS_DEMO_ARRAY[i].firstName,
    lastName: USERS_DEMO_ARRAY[i].lastName,
    mobile: USERS_DEMO_ARRAY[i].mobile,
    telephone: USERS_DEMO_ARRAY[i].telephone,
    timezone: COMPANY.country.timezone[0].id,
    userId: USERS_DEMO_ARRAY[i].userId,
  }));

  await db.insert(UserProfileTable).values(demoUserProfileData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Users.ts, UserProfile.ts');
}
