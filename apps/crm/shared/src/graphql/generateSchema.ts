import { writeSchema } from '../utils/writeSchema.js';
import { outputFile, typeDefsDir } from './paths.js';

writeSchema({ outputFile, typeDefsDir });

console.log(`[@apps/crm-shared] Wrote merged schema to ${outputFile}`);
