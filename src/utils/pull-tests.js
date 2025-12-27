import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Pull = require('check-tests/src/pull.js').default || require('check-tests/src/pull.js');
const Reporter = require('check-tests/src/reporter.js').default || require('check-tests/src/reporter.js');

export async function pullTests(apiKey, mdtestsDir = 'mdtests') {
  console.log(`📥 Pulling tests from Testomatio to ${mdtestsDir}/`);

  const fullPath = resolve(process.cwd(), mdtestsDir);
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${mdtestsDir}/`);
  }

  try {
    const reporter = new Reporter(apiKey.trim(), 'manual');
    const pull = new Pull(reporter, fullPath, { dryRun: false, force: true });
    await pull.pullFiles();
  } catch (error) {
    console.error(`❌ Failed to pull tests: ${error.message}`);
    throw error;
  }
}
