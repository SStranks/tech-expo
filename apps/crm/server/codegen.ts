/// <reference types="node" />
import type { CodegenConfig } from '@graphql-codegen/cli';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// NOTE:  'contextType' and 'mappers' paths starts from location of the output file of the generated types.
const config: CodegenConfig = {
  overwrite: true,
  schema: `${__dirname}/src/graphql/typedefs/*.graphql`,
  generates: {
    './src/graphql/generated/graphql.gen.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../../graphql/context.ts#GraphqlContext',
        skipTypename: true,
        useIndexSignature: true,
        useTypeImports: true,
        enumValues: {
          BusinessType: '../../models/company/Company.ts#BusinessType',
          CompanySize: '../../models/company/Company.ts#CompanySize',
        },
        mappers: {
          // NOTE: Key = Schema Type name. Value = What the Parent object is.
          Company: '../../models/company/Company.ts#CompanyDTO',
          CompanyDetailed: '../../models/company/Company.ts#CompanyDTO',
          Country: '../../models/country/Country.ts#CountryDTO',
        },
        scalars: {
          UUID: 'string',
        },
      },
    },
  },
};

export default config;
