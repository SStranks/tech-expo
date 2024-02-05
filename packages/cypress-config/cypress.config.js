import path from 'node:path';
import url from 'node:url';

const CWD = process.env.INIT_CWD;
const CUR = path.dirname(url.fileURLToPath(import.meta.url));

export default {
  chomeWebSecurity: false,
};
