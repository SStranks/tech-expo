/* eslint-disable security/detect-object-injection */
import type { TCompanyRoles, TUserRoles } from '#Config/schema/index.js';

import { faker } from '@faker-js/faker';

import { seedSettings } from '#Config/seedSettings.js';

import { randomUUID } from 'node:crypto';

const { COMPANY_EMAIL_DOMAIN, USER_ENTRY_COUNT } = seedSettings;

import argon2 from 'argon2';

// Generate single password for all non-demo 'USER ROLE'-only accounts
let hashedPassword: string;
async function generatePasswordHash() {
  hashedPassword = await argon2
    .hash(process.env.DEMO_ACC_GENERIC_NON_USER_PASSWORD as string, {
      secret: Buffer.from(process.env.POSTGRES_PEPPER as string),
    })
    .catch((error) => {
      throw new Error(`Error hashing password: ${error}`);
    });
}
await generatePasswordHash();

function generateUserBase() {
  const userId = randomUUID();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  // NOTE:  Bcrypt failed; required binaries must be build on respective CPU architecture; windows != docker linux-alpine; currently using volumes; would need to re-build docker alpine image with prebuilt binaries.
  // const password = faker.internet.password({ length: 20 });
  // const hashedPassword = bcrypt.hashSync(password, 1);
  const companyEmail = faker.internet.email({ firstName, lastName, provider: COMPANY_EMAIL_DOMAIN });
  const personalEmail = faker.internet.email({ firstName, lastName });
  const mobile = faker.phone.number({ style: 'international' });
  const telephone = faker.phone.number({ style: 'international' });
  return { companyEmail, firstName, hashedPassword, lastName, mobile, personalEmail, telephone, userId };
}

export function generateUsers() {
  return Array.from({ length: USER_ENTRY_COUNT }, () => {
    const userBaseData = generateUserBase();
    const companyRole = faker.helpers.weightedArrayElement<TCompanyRoles>([
      { value: 'SALES MANAGER', weight: 2 },
      { value: 'SALES PERSON', weight: 5 },
      { value: 'SALES INTERN', weight: 3 },
    ]);

    return {
      companyRole,
      ...userBaseData,
    };
  });
}

// TODO:  Substitute in known passwords and email addresses for demo-users to utilize;
export function generateDemoUsers() {
  const USER_ROLES: TUserRoles[] = ['ADMIN', 'MODERATOR', 'USER'];
  const COMPANY_ROLES: TCompanyRoles[] = ['ADMIN', 'SALES MANAGER', 'SALES PERSON'];

  const demoUsers = Array.from({ length: USER_ROLES.length }, (_, i) => {
    const userBaseData = generateUserBase();
    const userRole = USER_ROLES[i];
    const companyRole = COMPANY_ROLES[i];

    return {
      ...userBaseData,
      companyRole,
      userRole,
    };
  });

  return demoUsers;
}
