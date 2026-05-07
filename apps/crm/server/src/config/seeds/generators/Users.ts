import { faker } from '@faker-js/faker';

import { seedSettings } from '#Config/seedSettings.js';

import { randomUUID } from 'node:crypto';

const { COMPANY_EMAIL_DOMAIN, USER_ENTRY_COUNT } = seedSettings;

import type { UserRoles } from '@apps/crm-shared';

import type { CompanyRoles } from '#Models/domain/user/profile/profile.types.js';

import { toUUID } from '@apps/crm-shared/utils';
import argon2 from 'argon2';

import { secrets } from '#Config/secrets.js';

const { DEMO_ACC_GENERIC_NON_USER_PASSWORD, POSTGRES_PEPPER } = secrets;

// Generate single password for all non-demo 'USER ROLE'-only accounts
let hashedPassword: string;
async function generatePasswordHash() {
  hashedPassword = await argon2
    .hash(DEMO_ACC_GENERIC_NON_USER_PASSWORD, {
      secret: Buffer.from(POSTGRES_PEPPER),
    })
    .catch((error) => {
      throw new Error(`Error hashing password: ${error}`);
    });
}
await generatePasswordHash();

function generateUserBase() {
  const userId = toUUID(randomUUID());
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  /*
   * NOTE: Bcrypt failed; required binaries must be build on respective CPU architecture;
   * windows != docker linux-alpine;
   * currently using volumes;
   * would need to re-build docker alpine image with prebuilt binaries.
   * */
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
    const companyRole = faker.helpers.weightedArrayElement<CompanyRoles>([
      { value: 'SALES_MANAGER', weight: 2 },
      { value: 'SALES_PERSON', weight: 5 },
      { value: 'SALES_INTERN', weight: 3 },
    ]);

    return {
      companyRole,
      ...userBaseData,
    };
  });
}

// TODO:  Substitute in known passwords and email addresses for demo-users to utilize;
export function generateDemoUsers() {
  const rolePairs = [
    ['ADMIN', 'ADMIN'],
    ['MODERATOR', 'SALES_MANAGER'],
    ['USER', 'SALES_PERSON'],
  ] as const satisfies readonly [UserRoles, CompanyRoles][];

  const demoUsers = rolePairs.map(([userRole, companyRole]) => {
    const userBaseData = generateUserBase();

    return {
      ...userBaseData,
      companyRole,
      userRole,
    };
  });

  return demoUsers;
}
