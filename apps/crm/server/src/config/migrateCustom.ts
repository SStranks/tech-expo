/* eslint-disable security/detect-non-literal-fs-filename */
import { sql } from 'drizzle-orm';

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { postgresDB } from './dbPostgres.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
function filePath(relativePath: string): string {
  return path.join(__dirname, relativePath);
}

export async function SQL_Triggers() {
  const rawSQL = fs.readFileSync(filePath('./migrations/_triggers.sql'), 'utf8');
  await postgresDB.execute(sql.raw(rawSQL));
}
