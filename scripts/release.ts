#!/usr/bin/env tsx
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import prompt from 'prompt';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_PATH = resolve(__dirname, '../package.json');

type BumpType = 'patch' | 'minor' | 'major' | 'custom';

interface Pkg {
  name: string;
  version: string;
  [key: string]: unknown;
}

interface ReleaseOptions {
  dryRun: boolean;
  yes: boolean;
  skipBuild: boolean;
  tagPrefix: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function run(cmd: string, { dry = false }: { dry?: boolean } = {}): void {
  if (dry) {
    console.log(chalk.dim(`  [dry] ${cmd}`));
    return;
  }
  execSync(cmd, { stdio: 'inherit' });
}

function getPkg(): Pkg {
  return JSON.parse(readFileSync(PKG_PATH, 'utf8')) as Pkg;
}

function bumpVersion(current: string, type: BumpType, custom?: string): string {
  if (type === 'custom' && custom) return custom;
  const [major, minor, patch] = current.split('.').map(Number);
  if (type === 'major') return `${major + 1}.0.0`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function getGitLog(since: string): string {
  try {
    return execSync(`git log ${since}..HEAD --oneline --no-merges`, {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
  } catch {
    return execSync('git log --oneline --no-merges -10', {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
  }
}

function checkWorkingTree(): boolean {
  const status = execSync('git status --porcelain', {
    encoding: 'utf8',
    stdio: 'pipe',
  }).trim();
  return status.length === 0;
}

// ─── Commander setup ───────────────────────────────────────────────────────────

program
  .name('release')
  .description('Release a new version of @temanten/sdk to GitHub')
  .option('-d, --dry-run', 'preview all steps without making any changes')
  .option('-y, --yes', 'skip the final confirmation prompt')
  .option('--skip-build', 'skip the pnpm build step')
  .option('--tag-prefix <prefix>', 'git tag prefix', 'v')
  .parse();

const opts = program.opts<ReleaseOptions>();

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('\n' + chalk.bold.cyan('╔══════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Temanten SDK — Release Tool        ║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════╝') + '\n');

  if (opts.dryRun) {
    console.log(chalk.yellow.bold('⚠  DRY RUN — no changes will be made\n'));
  }

  // ── 1. Load current state ──────────────────────────────────────────────────
  const pkg = getPkg();
  const currentVersion = pkg.version;
  const lastTag = `${opts.tagPrefix}${currentVersion}`;

  console.log(chalk.bold('Package:  ') + chalk.white(pkg.name));
  console.log(chalk.bold('Current:  ') + chalk.yellow(`v${currentVersion}`));
  console.log(chalk.bold('Remote:   ') + chalk.dim('git@github.com:sementaraid/temanten-sdk.git'));

  // ── 2. Check working tree ──────────────────────────────────────────────────
  if (!checkWorkingTree() && !opts.dryRun) {
    console.log('\n' + chalk.red.bold('✖ Uncommitted changes detected.'));
    console.log(chalk.red('  Please commit or stash your changes before releasing.\n'));
    process.exit(1);
  }

  // ── 3. Show commits since last tag ────────────────────────────────────────
  console.log('\n' + chalk.bold.white('Changes since ' + chalk.cyan(lastTag) + ':'));
  const log = getGitLog(lastTag);
  if (log) {
    log.split('\n').forEach(line => {
      const spaceIdx = line.indexOf(' ');
      const hash = line.slice(0, spaceIdx);
      const message = line.slice(spaceIdx + 1);
      console.log(`  ${chalk.dim(hash)} ${message}`);
    });
  } else {
    console.log(chalk.dim('  (no new commits)'));
  }

  // ── 4. Inquirer — pick version bump ───────────────────────────────────────
  console.log('');
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  const { bumpType } = await inquirer.prompt<{ bumpType: BumpType }>([
    {
      type: 'list',
      name: 'bumpType',
      message: 'Select release type:',
      choices: [
        {
          name: `patch   ${chalk.dim(`${currentVersion} → ${major}.${minor}.${patch + 1}`)}`,
          value: 'patch',
        },
        {
          name: `minor   ${chalk.dim(`${currentVersion} → ${major}.${minor + 1}.0`)}`,
          value: 'minor',
        },
        {
          name: `major   ${chalk.dim(`${currentVersion} → ${major + 1}.0.0`)}`,
          value: 'major',
        },
        { name: 'custom  (enter manually)', value: 'custom' },
      ],
      default: 'patch',
    },
  ]);

  let customVersion: string | undefined;
  if (bumpType === 'custom') {
    const { version } = await inquirer.prompt<{ version: string }>([
      {
        type: 'input',
        name: 'version',
        message: 'Enter version (e.g. 1.2.3):',
        validate: (v: string) =>
          /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(v) ? true : 'Must be a valid semver (e.g. 1.2.3)',
      },
    ]);
    customVersion = version;
  }

  const newVersion = bumpVersion(currentVersion, bumpType, customVersion);
  const newTag = `${opts.tagPrefix}${newVersion}`;

  // ── 5. Show release plan ──────────────────────────────────────────────────
  console.log('\n' + chalk.bold.white('Release plan:'));
  console.log(`  ${chalk.dim('version')}   ${chalk.yellow(currentVersion)} → ${chalk.green.bold(newVersion)}`);
  console.log(`  ${chalk.dim('tag')}       ${chalk.green(newTag)}`);
  console.log(`  ${chalk.dim('build')}     ${opts.skipBuild ? chalk.dim('skipped') : 'pnpm build'}`);
  console.log(`  ${chalk.dim('steps')}     commit package.json → tag → push origin`);
  console.log(`  ${chalk.dim('ci')}        GitHub Actions will publish to npm on tag push`);

  // ── 6. prompt — type version to confirm ──────────────────────────────────
  if (!opts.yes) {
    console.log('');

    prompt.message = '';
    prompt.delimiter = '';
    prompt.colors = false;
    prompt.start({ stdout: process.stderr });

    let confirmed = false;
    try {
      const result = await prompt.get([
        {
          name: 'confirm',
          description: chalk.cyan(`Type "${newVersion}" to confirm release, or ENTER to abort: `),
          required: false,
          default: '',
        },
      ]);
      confirmed = (result.confirm as string).trim() === newVersion;
    } catch {
      confirmed = false;
    }

    if (!confirmed) {
      console.log('\n' + chalk.yellow('↩  Release aborted.') + '\n');
      process.exit(0);
    }
  }

  // ── 7. Execute release ────────────────────────────────────────────────────
  console.log('\n' + chalk.bold.white('Releasing…') + '\n');

  if (!opts.skipBuild) {
    console.log(chalk.cyan('▸') + ' Building SDK…');
    run('pnpm build', { dry: opts.dryRun });
    console.log(chalk.green('✔') + ' Build complete');
  }

  console.log(chalk.cyan('▸') + ' Updating package.json…');
  if (!opts.dryRun) {
    const updated = getPkg();
    updated.version = newVersion;
    writeFileSync(PKG_PATH, JSON.stringify(updated, null, 2) + '\n');
  } else {
    console.log(chalk.dim(`  [dry] package.json version → ${newVersion}`));
  }
  console.log(chalk.green('✔') + ` Version set to ${chalk.bold(newVersion)}`);

  console.log(chalk.cyan('▸') + ' Committing version bump…');
  run(`git add package.json`, { dry: opts.dryRun });
  run(`git commit -m "chore: release ${newTag}"`, { dry: opts.dryRun });
  console.log(chalk.green('✔') + ' Commit created');

  console.log(chalk.cyan('▸') + ` Creating tag ${chalk.bold(newTag)}…`);
  run(`git tag ${newTag}`, { dry: opts.dryRun });
  console.log(chalk.green('✔') + ' Tag created');

  console.log(chalk.cyan('▸') + ' Pushing to GitHub…');
  run(`git push origin HEAD`, { dry: opts.dryRun });
  run(`git push origin ${newTag}`, { dry: opts.dryRun });
  console.log(chalk.green('✔') + ' Pushed branch + tag');

  // ── 8. Done ───────────────────────────────────────────────────────────────
  console.log('\n' + chalk.bold.green('✨ Released successfully!'));
  console.log(
    chalk.dim(
      `   GitHub Actions will now publish ${chalk.white(`${pkg.name}@${newVersion}`)} to npm.\n`
    )
  );
}

main().catch((err: Error) => {
  console.error('\n' + chalk.red.bold('✖ Release failed:'), err.message);
  process.exit(1);
});
