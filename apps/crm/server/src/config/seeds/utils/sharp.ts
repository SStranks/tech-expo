import sharp from 'sharp';

import { readdir } from 'node:fs/promises';
import path from 'node:path';

const inputDir = '../avatars/jpg';
const outputDir = '../avatars/webp';

const files = await readdir(inputDir);

for (const file of files) {
  if (path.extname(file).toLowerCase() !== '.jpg') {
    continue;
  }

  await sharp(path.join(inputDir, file))
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${path.parse(file).name}.webp`));
}
