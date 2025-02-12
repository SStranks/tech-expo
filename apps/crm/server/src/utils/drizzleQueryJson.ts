/* eslint-disable security/detect-non-literal-fs-filename */
// DANGER:  Function only to be used in non-public code!
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const pathToTempFolder = path.resolve(CUR, '../temp');

// Exports the results of a drizzle query to JSON; map to host in temp folder
export async function drizzleQueryJSON(result: Record<string, unknown> | any[], fileName: string) {
  const fullPath = path.resolve(pathToTempFolder, `${fileName}.json`);
  try {
    const jsonData = JSON.stringify(result, null, 2);
    fs.writeFile(fullPath, jsonData, 'utf8', (err) => {
      console.log(`Error: Could not write data to JSON: ${err}`);
    });
  } catch (error) {
    throw new Error(`Error: Could not write data to JSON: ${error}`);
  }
}
