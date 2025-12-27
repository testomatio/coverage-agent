#!/usr/bin/env node

import { program } from 'commander';
import { prepareManualCoverage } from './manual.js';
import { prepareAutomatedCoverage } from './automated.js';

program
  .name('test-coverage-agent')
  .description('Code coverage analysis with Claude Code')
  .version('0.1.0');

program
  .command('manual')
  .description('Prepare manual tests coverage analysis')
  .option('-k, --api-key <key>', 'Testomatio API key')
  .option('-s, --tests-dir <dir>', 'Directory for tests (uses temp dir if not specified)')
  .option('-o, --output <file>', 'Output coverage file', 'coverage.manual.yml')
  .option('--skip-pull', 'Skip pulling tests from Testomatio')
  .action(prepareManualCoverage);

program
  .command('automated')
  .description('Prepare automated e2e tests coverage analysis')
  .option('-s, --tests-dir <dir>', 'Directory for tests (uses temp dir if not specified)')
  .option('-o, --output <file>', 'Output coverage file', 'coverage.e2e.yml')
  .action(prepareAutomatedCoverage);

program.parse();
