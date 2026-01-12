/// <reference types="node" />
/* eslint-disable perfectionist/sort-objects */
import type { CodegenConfig } from '@graphql-codegen/cli';

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const mergedSchemaFile = import.meta.resolve('@apps/crm-shared/graphql/schema');
const mergedSchemaFilePath = url.fileURLToPath(mergedSchemaFile);
const mergedSchema = fs.readFileSync(mergedSchemaFilePath);

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
      watchPattern: [mergedSchemaFilePath],
    },
  },
  hooks: { afterStart: [writeMergedSchema] },
};

export default config;
