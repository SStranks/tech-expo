/// <reference types="node" />
import type { CodegenConfig } from '@graphql-codegen/cli';

import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));

// NOTE:  'contextType' and 'mappers' paths starts from location of the output file of the generated types.
const config: CodegenConfig = {
  overwrite: true,
  schema: `${CUR}/src/graphql/typedefs/*.graphql`,
  generates: {
    './src/graphql/generated/graphql.gen.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../../graphql/context.ts#IGraphqlContext',
        skipTypename: true,
        useIndexSignature: true,
        useTypeImports: true,
        mappers: {
          Company: '../../models/company/Company.ts#TCompanyDTO',
          Country: '../../models/country/Country.ts#TCountryDTO',
        },
        scalars: {
          UUID: 'import("crypto").UUID',
        },
      },
    },
  },
};

export default config;
