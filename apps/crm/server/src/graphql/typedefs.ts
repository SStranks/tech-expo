import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const typesPaths = path.resolve(__dirname, './typedefs');

const typesArray = loadFilesSync(typesPaths, { extensions: ['graphql'] });

export const mergedSchema = print(mergeTypeDefs(typesArray));
export default mergeTypeDefs(typesArray);
