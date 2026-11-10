/* eslint-disable security/detect-non-literal-fs-filename -- IMPORTANT: for non-client facing code only */
import Papa from 'papaparse';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverDataDir = path.resolve(__dirname, '../../../../data');
const DATA_DIR = process.env['DATA_DIR'] || serverDataDir;

export function importJSONSeed<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Seed file missing: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as T;
}

/**
 * Import CSV file
 * @function importCSVFile
 * @template T expected row structure
 * @param {string} filename - absolute path to the CSV file
 * @throws If CSV parsing is unsuccessful; console.logs array of errors
 * @returns {T[]} T[] - of rows from CSV file
 */
export function importCSVFile<T>(filename: string, filePath?: string): T[] {
  const absoluteFilePath = filePath || path.join(DATA_DIR, filename);

  if (!fs.existsSync(absoluteFilePath)) {
    throw new Error(`CSV file missing: ${absoluteFilePath}`);
  }

  const { data, errors } = Papa.parse<T>(absoluteFilePath, {
    dynamicTyping: true, // Converts numeric and boolean to their respective type
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0)
    throw new Error(`Error parsing CSV file: ${path.basename(absoluteFilePath)}.\n Errors: ${JSON.stringify(errors)}`);
  return data;
}
