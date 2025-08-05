import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const CUR_DIR = path.dirname(url.fileURLToPath(import.meta.url));

export const EMAIL_TEMPLATE_VERIFICATION = fs.readFileSync(
  path.join(CUR_DIR, './VerificationEmailTemplate.html'),
  'utf8'
);
