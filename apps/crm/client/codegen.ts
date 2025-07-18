/// <reference types="node" />
import type { CodegenConfig } from '@graphql-codegen/cli';
import { mergedSchema } from '../server/src/graphql/typedefs';

import path from 'node:path';
import fs from 'node:fs';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/graphql/generated/schema.graphql',
  documents: './src/graphql/queries.ts',
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      plugins: [],
      config: {
        skipTypename: true,
        useTypeImports: true,
      },
      hooks: { onWatchTriggered: [writeMergedSchema] },
      watchPattern: ['../server/src/graphql/typedefs/*.graphql'],
    },
  },
  hooks: { afterStart: [writeMergedSchema] },
};

// NOTE:  This hook is required because @0no-go/graphqlsp plugin can't handle multiple schema files. Merges all .graphql schema files from server into single schema file in Client.
function writeMergedSchema() {
  const outputPath = path.resolve(__dirname, './src/graphql/generated/schema.graphql');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, mergedSchema);
  console.log(`[codegen] Wrote merged schema to ${outputPath}`);
}

export default config;
