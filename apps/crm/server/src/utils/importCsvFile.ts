/* eslint-disable security/detect-non-literal-fs-filename */
// DANGER:  Function only to be used in non-public code
import Papa from 'papaparse';

import fs from 'node:fs';
import path from 'node:path';

/**
 * Import CSV file
 * @function importCSVFile
 * @template T expected row structure
 * @param {string} targetFilePath - absolute path to the CSV file
 * @throws If CSV parsing is unsuccessful; console.logs array of errors
 * @returns {T[]} T[] - of rows from CSV file
 */
function importCSVFile<T>(targetFilePath: string): T[] {
  const CSVFileName = path.basename(targetFilePath);
  const CSVFile = fs.readFileSync(targetFilePath, 'utf8');
  if (!CSVFile) throw new Error('Error: Unable to read CSV file');

  const { data, errors } = Papa.parse<T>(CSVFile, {
    dynamicTyping: true, // Converts numeric and boolean to their respective type
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) throw new Error(`Error parsing CSV file: ${CSVFileName}.\n Errors: ${JSON.stringify(errors)}`);
  return data;
}

export default importCSVFile;
