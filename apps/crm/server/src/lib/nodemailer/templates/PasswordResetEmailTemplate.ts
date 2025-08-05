import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const CUR_DIR = path.dirname(url.fileURLToPath(import.meta.url));

export const EMAIL_TEMPLATE_PASSWORD_RESET = fs.readFileSync(
  path.resolve(CUR_DIR, './PasswordResetEmailTemplate.html'),
  'utf8'
);
