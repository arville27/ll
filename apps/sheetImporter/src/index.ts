import fs from 'node:fs/promises';
import { exit } from 'process';

(async () => {
  if (process.argv.length <= 2) {
    console.log("Missing required parameter 'Job name'");
    exit(1);
  }

  process.argv.shift();
  process.argv.shift();
  const [jobName, ...jobParam] = [...process.argv];

  const availableJobs = await fs.readdir('./src/entrypoint');

  const entrypoint = availableJobs.find(
    (job) => job.toLowerCase() == jobName.toLowerCase()
  );

  if (!entrypoint) {
    console.log("Invalid 'Job name'");
    exit(1);
  }

  const job = (await import('./entrypoint/' + entrypoint)) as {
    default: (...args: string[]) => Promise<void>;
  };

  console.log('Execute', entrypoint);

  await job.default(...jobParam);
})();
