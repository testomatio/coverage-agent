import { pullTests } from './utils/pull-tests.js';
import { getApiKey } from './utils/config.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function prepareManualCoverage(options, command) {
  console.log('🚀 Preparing Manual Test Coverage Agent for Claude Code\n');

  const apiKey = getApiKey(options.apiKey);
  if (!apiKey) {
    console.error('❌ Testomatio API key is required');
    console.error('   Set TESTOMATIO environment variable or use --api-key option');
    process.exit(1);
  }

  let testsPath;
  if (options.testsDir) {
    testsPath = resolve(process.cwd(), options.testsDir);
  } else {
    testsPath = createTempTestsDir();
  }

  if (!options.skipPull) {
    await pullTests(apiKey, testsPath);
  } else {
    console.log('⏭️  Skipping test pull (using existing files)\n');
  }

  const promptPath = preparePromptFile(testsPath, options.output);
  showNextSteps(promptPath, options, testsPath);
}

function createTempTestsDir() {
  const tempDir = resolve(tmpdir(), 'testomatio-manual-tests');
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
}

function preparePromptFile(testsPath, outputFile) {
  const sourcePath = resolve(__dirname, 'manual-prompt.md');

  if (!existsSync(sourcePath)) {
    console.warn(`⚠️  Prompt file not found: ${sourcePath}`);
    return sourcePath;
  }

  let content = readFileSync(sourcePath, 'utf8');
  content = content.replaceAll('{tests_dir}', testsPath);
  content = content.replaceAll('{output}', outputFile);

  const tmpDir = tmpdir();
  const targetPath = resolve(tmpDir, 'testomatio-manual-coverage-prompt.md');
  writeFileSync(targetPath, content, 'utf8');

  return targetPath;
}

function showNextSteps(promptPath, options, testsPath) {
  const usingTemp = !options.testsDir;

  console.log('✅ Setup complete!\n');
  console.log('━'.repeat(60));
  console.log('📋 Configuration:\n');
  console.log(`  Tests directory:   ${testsPath}`);
  if (usingTemp) {
    console.log(`                    (using temp directory)`);
  }
  console.log(`  Output file:        ${options.output}\n`);

  console.log('To change configuration, use:\n');
  console.log(`  npx @testomatio/coverage-agent manual \\`);
  console.log(`    --tests-dir <dir> \\`);
  console.log(`    --output <file> \\`);
  console.log(`    --skip-pull\n`);

  console.log('━'.repeat(60));
  console.log('📋 Next Steps:\n');
  console.log('  Start Claude Code with the coverage agent prompt:\n');
  console.log(`  claude "launch manual test coverage agent" \\`);
  console.log(`       --append-system-prompt ${promptPath}\n`);
  console.log('━'.repeat(60));
}
