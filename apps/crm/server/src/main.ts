import { validateEnvironmentVariables } from '#Config/env.js';
import { initializeDockerSecrets } from '#Config/secrets.js';

validateEnvironmentVariables();
initializeDockerSecrets();

await import('./server.js');
