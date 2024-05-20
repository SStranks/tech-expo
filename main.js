import { execSync } from 'node:child_process';
// const main = async () => {
//   try {
//     const { stderr, stdout, status } = spawnSync('pnpm', ['outdated', '--format=json', '-r'], { cwd: process.cwd() });
//     console.log(stderr, stdout.toString(), status);
//     if (status !== 0) {
//       const errorText = stderr.toString();
//       console.log('ERROR&&&', status, stderr.toString());

//       throw new Error(errorText);
//     }
//     console.log('RESULT***', stdout.toString());
//   } catch (error) {
//     // console.log(error.stdout.toString('utf-8'));
//     console.log('ERROR***', error.message);
//     console.log('ERROR***', error.status);
//     // setFailed(error); // This is the GitHub Action error handler
//   }
// };
const main = async () => {
  try {
    const pnpmCommand = 'pnpm outdated -r --format json';
    const result = execSync(pnpmCommand, { cwd: process.cwd() });
    // No outdated packages
    if (result.toString().trim() === '{}') return generateNoOutdatedMessage();
    // eslint-disable-next-line unicorn/catch-error-name
  } catch (out) {
    const { stdout, status } = out;
    console.log(status);
    console.log(stdout.toString());
    // console.log(error.stdout.toString('utf-8'));
    // console.log('ERROR***', error.message);
    // console.log('ERROR***', error.status);
    // setFailed(error); // This is the GitHub Action error handler
  }
};
main();
