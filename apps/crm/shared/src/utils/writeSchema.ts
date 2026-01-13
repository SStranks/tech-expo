import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';

import fs from 'node:fs';
import path from 'node:path';

export interface GenerateSchemaOptions {
  typeDefsDir: string;
  outputFile: string;
}

export function writeSchema({ outputFile, typeDefsDir }: GenerateSchemaOptions): void {
  const typesArray = loadFilesSync(typeDefsDir, {
    extensions: ['graphql'],
  });

  const mergedSchema = print(mergeTypeDefs(typesArray));

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, mergedSchema);
}
