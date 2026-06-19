#!/usr/bin/env node
/**
 * Local release script for @fly4react/vestaboard.
 *
 * Usage:
 *   pnpm release patch                    # 0.1.0 -> 0.1.1
 *   pnpm release minor                    # 0.1.0 -> 0.2.0
 *   pnpm release major                    # 0.1.0 -> 1.0.0
 *   pnpm release 0.2.0                    # explicit stable version
 *   pnpm release 0.2.0-beta.0             # explicit prerelease version
 *   pnpm release patch --dry-run          # preview only
 */

import { execSync } from 'node:child_process';
import process from 'node:process';

function run(cmd, options = {}) {
  return execSync(cmd, {
    stdio: options.silent ? 'pipe' : 'inherit',
    encoding: 'utf-8',
    ...options,
  });
}

function runSilent(cmd) {
  return run(cmd, { silent: true }).trim();
}

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const positional = args.filter((arg) => !arg.startsWith('--'));

if (positional.length !== 1) {
  console.error('Usage: pnpm release <patch|minor|major|x.y.z[-prerelease]> [--dry-run]');
  process.exit(1);
}

const bump = positional[0];
const validBump = ['patch', 'minor', 'major'].includes(bump);
const validVersion = /^\d+\.\d+\.\d+([-+].+)?$/.test(bump);

if (!validBump && !validVersion) {
  console.error(
    `Invalid release argument: "${bump}". Expected patch, minor, major, or a semver version.`
  );
  process.exit(1);
}

// Ensure we are on the release branch.
const currentBranch = runSilent('git branch --show-current');
if (currentBranch !== 'release') {
  console.error(
    `❌ Must be on the "release" branch to cut a release. Current branch: "${currentBranch}".`
  );
  process.exit(1);
}

// Ensure the working tree is clean.
try {
  runSilent('git diff --exit-code');
  runSilent('git diff --cached --exit-code');
} catch {
  console.error(
    '❌ Working tree is not clean. Please commit or stash your changes before releasing.'
  );
  process.exit(1);
}

// Ensure the release branch is up to date with origin (if origin/release exists).
try {
  const remoteExists = runSilent('git ls-remote --heads origin release').length > 0;
  if (remoteExists) {
    runSilent('git fetch origin release');
    const localAhead = runSilent(
      'git merge-base --is-ancestor origin/release release && echo true || echo false'
    );
    if (localAhead !== 'true') {
      console.error(
        '❌ Local "release" branch is behind origin/release. Please pull the latest changes.'
      );
      process.exit(1);
    }
  } else {
    console.warn('⚠️  origin/release does not exist yet. Skipping remote sync check.');
  }
} catch {
  console.error('❌ Failed to verify "release" branch sync with origin.');
  process.exit(1);
}

// Build commit-and-tag-version arguments.
const catvArgs = ['commit-and-tag-version', '--release-as', bump];
if (isDryRun) {
  catvArgs.push('--dry-run');
} else {
  // We commit and tag ourselves so we can format the generated files first.
  catvArgs.push('--skip.commit', '--skip.tag');
}

const catvCmd = `pnpm exec ${catvArgs.join(' ')}`;

console.log(`\n🏷️  Running: ${catvCmd}\n`);

try {
  run(catvCmd);
} catch (error) {
  console.error('\n❌ Release failed during version/changelog step.');
  process.exit(error.status || 1);
}

if (isDryRun) {
  console.log('\n✅ Dry-run completed. No changes were made.');
  process.exit(0);
}

// Format generated files before committing.
console.log('\n🎨 Formatting generated files...\n');
try {
  run('pnpm exec prettier --write package.json CHANGELOG.md');
} catch (error) {
  console.error('\n❌ Failed to format generated files.');
  process.exit(error.status || 1);
}

// Read the new version and create the commit/tag.
let version;
try {
  version = runSilent('node -p "require(\'./package.json\').version"');
} catch (error) {
  console.error('\n❌ Failed to read version from package.json.');
  process.exit(error.status || 1);
}

const tag = `v${version}`;
const message = `chore(release): ${version}`;

console.log(`\n📝 Committing release ${version}...\n`);
try {
  run('git add package.json CHANGELOG.md');
  run(`git commit -m "${message}"`);
  run(`git tag -a "${tag}" -m "${message}"`);
} catch (error) {
  console.error('\n❌ Failed to commit or tag release.');
  process.exit(error.status || 1);
}

// Push the release commit and the new tag.
console.log('\n🚀 Pushing release commit and tag to origin/release...\n');
try {
  run('git push origin release --follow-tags');
} catch (error) {
  console.error('\n❌ Failed to push release commit/tag to origin.');
  process.exit(error.status || 1);
}

console.log('\n✅ Release pushed. GitHub Actions will publish to npm shortly.');
