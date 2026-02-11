/* eslint-disable security/detect-non-literal-fs-filename */
// DANGER:  Function only to be used in non-public code!
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const pathToTempFolder = path.resolve(__dirname, '../temp');

// Exports the results of a drizzle query to JSON; map to host in temp folder
export function drizzleQueryJSON(result: Record<string, unknown> | unknown[], fileName: string) {
  const fullPath = path.resolve(pathToTempFolder, `${fileName}.json`);
  try {
    const jsonData = JSON.stringify(result, null, 2);
    fs.writeFile(fullPath, jsonData, 'utf8', (err) => {
      console.log(`Error: Could not write data to JSON: ${err}`);
    });
  } catch (error) {
    throw new Error(`Error: Could not write data to JSON: ${error as Error}`);
  }
}
