import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

import url from 'node:url';

const graphqlFolderURL = new URL('@apps/crm-shared/graphql/', import.meta.url);
const graphqlFolderPath = url.fileURLToPath(graphqlFolderURL);

const typesArray = loadFilesSync(graphqlFolderPath, { extensions: ['graphql'] });

export default mergeTypeDefs(typesArray);
