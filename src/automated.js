import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function prepareAutomatedCoverage(options, command) {
  console.log('🚀 Preparing Automated E2E Test Coverage Agent for Claude Code\n');

  let testsPath;
  if (options.testsDir) {
    testsPath = resolve(process.cwd(), options.testsDir);
  } else {
    testsPath = createTempTestsDir();
  }

  const promptPath = preparePromptFile(testsPath, options.output);
  showNextSteps(promptPath, options, testsPath);
}

function createTempTestsDir() {
  const tempDir = resolve(tmpdir(), 'testomatio-e2e-tests');
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
}

function preparePromptFile(testsPath, outputFile) {
  const sourcePath = resolve(__dirname, 'automated-prompt.md');

  if (!existsSync(sourcePath)) {
    console.warn(`⚠️  Prompt file not found: ${sourcePath}`);
    return sourcePath;
  }

  let content = readFileSync(sourcePath, 'utf8');
  content = content.replaceAll('{tests_dir}', testsPath);
  content = content.replaceAll('{output}', outputFile);

  const tmpDir = tmpdir();
  const targetPath = resolve(tmpDir, 'testomatio-automated-coverage-prompt.md');
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
  console.log(`  npx @testomatio/coverage-agent automated \\`);
  console.log(`    --tests-dir <dir> \\`);
  console.log(`    --output <file>\n`);

  console.log('━'.repeat(60));
  console.log('📋 Next Steps:\n');
  console.log('  Start Claude Code with the coverage agent prompt:\n');
  console.log(`  claude "launch automated e2e test coverage agent" \\`);
  console.log(`       --append-system-prompt ${promptPath}\n`);
  console.log('━'.repeat(60));
}
