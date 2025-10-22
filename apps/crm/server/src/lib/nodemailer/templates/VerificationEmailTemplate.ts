import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const EMAIL_TEMPLATE_VERIFICATION = fs.readFileSync(
  path.join(__dirname, './VerificationEmailTemplate.html'),
  'utf8'
);
