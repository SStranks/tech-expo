/* eslint-disable perfectionist/sort-objects */
/// <reference types="node" />
import type { CodegenConfig } from '@graphql-codegen/cli';

import fs from 'node:fs';
import path from 'node:path';

import { mergedSchema } from '../server/src/graphql/typedefs';

/*
// NOTE: .
This hook is required because @0no-go/graphqlsp plugin can't handle multiple schema files.
Merges all .graphql schema files from server into single schema file in Client.
*/
function writeMergedSchema() {
  const outputPath = path.resolve(__dirname, './src/graphql/generated/schema.graphql');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, mergedSchema);
  console.log(`[codegen] Wrote merged schema to ${outputPath}`);
}

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

export default config;
