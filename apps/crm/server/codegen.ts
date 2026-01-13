/// <reference types="node" />
import type { CodegenConfig } from '@graphql-codegen/cli';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const mergedSchema = import.meta.resolve('@apps/crm-shared/graphql/schema');

// NOTE:  'contextType' and 'mappers' paths starts from location of the output file of the generated types.
const config: CodegenConfig = {
  overwrite: true,
  schema: path.relative(__dirname, url.fileURLToPath(mergedSchema)),
  generates: {
    './src/graphql/generated/graphql.gen.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../../graphql/context.ts#GraphqlContext',
        skipTypename: true,
        useIndexSignature: true,
        useTypeImports: true,
        enumValues: {
          BusinessType: '../../models/domain/company/company.types.ts#BusinessType',
          CompanyRole: '../../models/domain/user/profile/profile.types.ts#CompanyRoles',
          CompanySize: '../../models/domain/company/company.types.ts#CompanySize',
        },
        mappers: {
          // NOTE: Key = Schema Type name. Value = What the Parent object is.
          Company: '../../models/domain/company/company.dto.ts#CompanyDTO',
          CompanyDetailed: '../../models/domain/company/company.dto.ts#CompanyDTO',
          Country: '../../models/domain/country/country.dto.ts#CountryDTO',
          UserProfile: '../../models/domain/user/profile/profile.dto.ts#UserProfileDTO',
        },
        scalars: {
          UUID: '@apps/crm-shared#UUID',
        },
      },
    },
  },
};

export default config;
