import { writeSchema } from '../utils/writeSchema.ts';
import { outputFile, typeDefsDir } from './paths.ts';

writeSchema({ outputFile, typeDefsDir });

console.log(`[@apps/crm-shared] Wrote merged schema to ${outputFile}`);
