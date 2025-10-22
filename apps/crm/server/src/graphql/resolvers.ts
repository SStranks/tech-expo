import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const resolversPath = path.resolve(__dirname, './resolvers');

const resolversArray = loadFilesSync(resolversPath);

export default mergeResolvers(resolversArray);
