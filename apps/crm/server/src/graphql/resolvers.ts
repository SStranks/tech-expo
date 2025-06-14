import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';

import path from 'node:path';
import url from 'node:url';

const CUR_PATH = path.dirname(url.fileURLToPath(import.meta.url));
const resolversPath = path.resolve(CUR_PATH, './resolvers');

const resolversArray = loadFilesSync(resolversPath);

export default mergeResolvers(resolversArray);
