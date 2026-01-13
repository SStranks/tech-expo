import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
export const outputFile = path.join(__dirname, '../../dist/graphql/schema.graphql');
export const typeDefsDir = path.resolve(__dirname, './typedefs');
