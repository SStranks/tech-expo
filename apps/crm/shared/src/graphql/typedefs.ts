import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const typesPaths = path.resolve(__dirname, './typedefs');
const typesArray = loadFilesSync(typesPaths, { extensions: ['graphql'] });
const mergedSchema = print(mergeTypeDefs(typesArray));

const outputPath = path.join(__dirname, '../../dist/graphql/schema.graphql');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, mergedSchema);

console.log(`[shared] Wrote merged schema to ${outputPath}`);
