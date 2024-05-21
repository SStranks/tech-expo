import * as core from '@actions/core';
import semver from 'semver';
import { SummaryTableRow } from '@actions/core/lib/summary';
import { spawnSync } from 'node:child_process';
// import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
// import path from 'node:path';
// import url from 'node:url';
import { markdownTableFormatter } from './util.js';

// TEMP DEV: .
// const CUR = path.dirname(url.fileURLToPath(import.meta.url));
// const SUMMARY_FILE = path.join(CUR, 'output.md');
// if (existsSync(SUMMARY_FILE)) {
//   unlinkSync(SUMMARY_FILE);
// }
// writeFileSync(SUMMARY_FILE, '', 'utf8');
// process.env.GITHUB_STEP_SUMMARY = SUMMARY_FILE;
// TEMP DEV: .

interface IPnpmRecursiveOutdated {
  current: string;
  latest: string;
  wanted: string;
  isDeprecated: boolean;
  dependencyType: string;
  dependentPackages: { name: string; location: string }[];
}

const summaryNoOutdated = () => {
  core.summary.addHeading('All dependencies are current');
  core.summary.write();
};

const summaryOutdated = (input: string) => {
  let majorTableRows: SummaryTableRow[] = [];
  let minorTableRows: SummaryTableRow[] = [];
  let patchTableRows: SummaryTableRow[] = [];

  const json = JSON.parse(input);
  const jsonEntries: [string, IPnpmRecursiveOutdated][] = Object.entries(json);
  jsonEntries.forEach(([name, data]) => {
    const semverDiff = semver.diff(data.current, data.latest);

    let deprecated;
    if (data['isDeprecated']) deprecated = 'Deprecated';
    const dependentPackages = data['dependentPackages']
      .map(({ name }) => name)
      .join('<br>')
      .trim();

    const tableRow = [name, data.current, deprecated ?? data.latest, dependentPackages];

    if (semverDiff === 'major' || semverDiff === 'premajor') majorTableRows.push(tableRow);
    if (semverDiff === 'minor' || semverDiff === 'preminor') minorTableRows.push(tableRow);
    if (semverDiff === 'patch' || semverDiff === 'prepatch') patchTableRows.push(tableRow);
  });

  const tableMarkdown = markdownTableFormatter(majorTableRows, minorTableRows, patchTableRows);
  core.summary.addRaw(tableMarkdown);
  core.summary.write();
};

const main = async () => {
  try {
    const { stderr, stdout, status } = spawnSync('pnpm', ['outdated', '--format=json', '-r'], { cwd: process.cwd() });

    // Process completed; packages are all up-to-date
    if (status === 0) return summaryNoOutdated();
    // Process terminated by PNPM; outdated packages
    if (status === 1) {
      return summaryOutdated(stdout.toString('utf8'));
    } else {
      const errorText = stderr.toString();
      throw new Error(errorText);
    }
  } catch (error) {
    core.setFailed((error as Error).message);
  }
};

main();
