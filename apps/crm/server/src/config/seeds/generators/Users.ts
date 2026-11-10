/* eslint-disable security/detect-non-literal-fs-filename */
import { faker } from '@faker-js/faker';

import { seedSettings } from '#Config/seedSettings.js';

import { randomUUID } from 'node:crypto';

const { COMPANY_EMAIL_DOMAIN, DEMO_ACCOUNT_GENERIC_NON_USER_COUNT } = seedSettings;

import type { UserRoles, UUID } from '@apps/crm-shared';

import type { CompanyRoles } from '#Models/domain/user/profile/profile.types.js';

import argon2 from 'argon2';

import { env } from '#Config/env.js';
import { secrets } from '#Config/secrets.js';
import { asUserId } from '#Models/domain/user/user.mapper.js';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { SERVER_STORAGE_DIR } = env('development');

/*
 * NOTE: Bcrypt module failed; required binaries must be build on respective CPU architecture;
 * windows != docker linux-alpine;
 * currently using volumes;
 * would need to re-build docker alpine image with prebuilt binaries.
 * */

const {
  DEMO_ACCOUNT_GENERIC_NON_USER_PASSWORD,
  DEMO_ACCOUNT_USER_PASSWORD,
  DEMO_ACCOUNT_MODERATOR_PASSWORD,
  DEMO_ACCOUNT_ADMIN_PASSWORD,
  POSTGRES_PEPPER,
} = secrets;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverStorageDir = path.resolve(SERVER_STORAGE_DIR);
const serverAvatarDir = path.resolve(serverStorageDir, 'avatars');
const avatarDir = path.resolve(__dirname, '../avatars/webp');
const avatarFilenames = fs
  .readdirSync(avatarDir)
  .filter((file) => path.extname(file).toLowerCase() === '.webp')
  .toSorted();

fs.mkdirSync(serverAvatarDir, { recursive: true });

function generateUserAvatar() {
  const avatarName = avatarFilenames.pop();
  if (avatarName === undefined) throw new Error('Avatar collection fully consumed');

  try {
    fs.copyFileSync(path.resolve(avatarDir, avatarName), path.resolve(serverAvatarDir, avatarName));
  } catch (error) {
    console.error('Seeding error:', error);
    throw new Error('Avatar image could not be copied to server storage', { cause: error });
  }

  return `avatars/${avatarName}`;
}

async function generatePasswordHash(unhashedPassword: string) {
  const hashedPassword = await argon2
    .hash(unhashedPassword, {
      secret: Buffer.from(POSTGRES_PEPPER),
    })
    .catch((error) => {
      throw new Error(`Error hashing password: ${error}`);
    });

  return hashedPassword;
}

function generateUserBase() {
  const userId = asUserId(randomUUID() as UUID);
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const companyEmail = faker.internet.email({ firstName, lastName, provider: COMPANY_EMAIL_DOMAIN });
  const personalEmail = faker.internet.email({ firstName, lastName });
  const mobile = faker.phone.number({ style: 'international' });
  const telephone = faker.phone.number({ style: 'international' });
  const image = generateUserAvatar();
  return { companyEmail, firstName, image, lastName, mobile, personalEmail, telephone, userId };
}

export async function generateGenericUsers() {
  const hashedPassword = await generatePasswordHash(DEMO_ACCOUNT_GENERIC_NON_USER_PASSWORD);

  return Array.from({ length: DEMO_ACCOUNT_GENERIC_NON_USER_COUNT }, () => {
    const userBaseData = generateUserBase();
    const companyRole = faker.helpers.weightedArrayElement<CompanyRoles>([
      { value: 'SALES_MANAGER', weight: 2 },
      { value: 'SALES_PERSON', weight: 5 },
      { value: 'SALES_INTERN', weight: 3 },
    ]);

    return {
      companyRole,
      ...userBaseData,
      hashedPassword,
    };
  });
}

export async function generateDemoUsers() {
  const settings = [
    ['ADMIN', 'ADMIN', DEMO_ACCOUNT_ADMIN_PASSWORD],
    ['MODERATOR', 'SALES_MANAGER', DEMO_ACCOUNT_MODERATOR_PASSWORD],
    ['USER', 'SALES_PERSON', DEMO_ACCOUNT_USER_PASSWORD],
  ] as const satisfies readonly [UserRoles, CompanyRoles, string][];

  const demoUsers = await Promise.all(
    settings.map(async ([userRole, companyRole, password]) => {
      const userBaseData = generateUserBase();
      const hashedPassword = await generatePasswordHash(password);

      return {
        ...userBaseData,
        companyRole,
        hashedPassword,
        userRole,
      };
    })
  );

  return demoUsers;
}
