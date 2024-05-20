import { execSync } from 'node:child_process';
// import path from 'node:path';
// import url from 'node:url';

// interface NodeError extends Error {
//   status?: number;
// }

const generateNoOutdatedMessage = () => console.log('No Outdated Packages');

const main = async (): Promise<void> => {
  try {
    const pnpmCommand = 'pnpm outdated -r --format json';
    const result = execSync(pnpmCommand);

    // No outdated packages
    if (result.toString().trim() === '{}') return generateNoOutdatedMessage();
    // Pipe JSON to Markdown constructor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.log(error.stdout.toString());
    console.log(error.stderr.toString());

    // console.log('ERROR***', (error as NodeError).message);
    // console.log('ERROR***', (error as NodeError).status);
    // setFailed(error); // This is the GitHub Action error handler
  }
};

main();
