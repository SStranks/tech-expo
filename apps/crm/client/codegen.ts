/* eslint-disable perfectionist/sort-objects */
import type { CodegenConfig } from '@graphql-codegen/cli';

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const mergedSchemaFilePathAbsolute = import.meta.resolve('@apps/crm-shared/graphql/schema');
const mergedSchemaFilePathRelative = path.relative(__dirname, url.fileURLToPath(mergedSchemaFilePathAbsolute));

/*
// NOTE: .
This hook is required because @0no-go/graphqlsp plugin can't handle multiple schema files.
Merges all .graphql schema files from server into single schema file in Client.
Plugin configuration in tsconfig.json.
*/
function writeMergedSchema() {
  const outputPath = path.resolve(__dirname, './src/graphql/generated/schema.graphql');
  const mergedSchema = fs.readFileSync(mergedSchemaFilePathRelative);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, mergedSchema);
  console.log(`[codegen] Wrote merged schema to ${outputPath}`);
}

const config: CodegenConfig = {
  overwrite: true,
  schema: mergedSchemaFilePathRelative,
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
      hooks: { afterOneFileWrite: [writeMergedSchema] },
      watchPattern: ['./src/graphql/generated/*.ts', '!./src/graphql/generated/schema.graphql'],
    },
  },
  hooks: { afterStart: [writeMergedSchema] },
};

export default config;
