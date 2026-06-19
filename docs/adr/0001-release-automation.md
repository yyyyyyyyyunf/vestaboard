# ADR 0001: Release Automation for @fly4react/vestaboard

## Status

Accepted

## Context

`@fly4react/vestaboard` is a single-package React component library published to npm under the `@fly4react` scope. We needed a repeatable, auditable release process that:

- Publishes from a controlled branch rather than a developer's local machine.
- Runs the full quality gate (format, lint, test, build) before any publish step.
- Supports both stable and prerelease versions.
- Generates a changelog and GitHub Release automatically.
- Keeps `main` synchronized with the release branch.

The reference project `react-toolkit` uses a heavier monorepo workflow with per-package change detection and multiple release branches. Vestaboard is a single package, so that complexity is unnecessary.

## Decision

We will use a **two-phase release process**:

1. **Local preparation** via `pnpm release <patch|minor|major|x.y.z[-prerelease]>`.
   - The script (`scripts/release.js`) validates that the current branch is `release`, the working tree is clean, and the branch is in sync with `origin/release`.
   - It uses `commit-and-tag-version` to bump `package.json`, generate `CHANGELOG.md`, commit the changes, and create a `v*` git tag.
   - Finally it pushes the commit and tag to `origin/release`.

2. **CI publication** triggered by the `v*` tag push.
   - `.github/workflows/release.yml` verifies the tag is on the `release` branch.
   - It runs `format:check`, `lint`, `test`, and `build`.
   - On success, it publishes to npm with `--access public` and `--provenance`.
   - It detects prerelease versions (e.g. `0.2.0-beta.0`) and publishes them with the corresponding dist-tag (`beta`, `alpha`, etc.) instead of `latest`.
   - It creates a GitHub Release using the release notes extracted from `CHANGELOG.md`.
   - It merges `release` back into `main` automatically.

### Branch model

- `develop`: active development branch.
- `release`: release preparation branch; the only branch from which tags may be published.
- `main`: stable branch; updated automatically after each release.

### Tooling choices

- `commit-and-tag-version` for version bumping and changelog generation. It is the actively maintained successor of `standard-version`, supports `--release-as`, and understands the conventional commits already used in this repository.
- `pnpm@11.8.0` pinned via the `packageManager` field to guarantee consistent lockfile behavior locally and in CI.
- GitHub Actions with `pnpm/action-setup@v4` and `actions/setup-node@v4` for dependency setup.

## Consequences

### Positive

- Releases are reproducible and audited through GitHub Actions.
- npm provenance proves that published packages were built from this repository.
- Changelog and GitHub Release are always in sync with the published version.
- Prereleases are published to separate dist-tags, preventing users from accidentally installing beta versions via `latest`.

### Negative / Risks

- If `main` is protected with "require pull request reviews", the auto-merge step will fail. In that case the workflow must be adjusted to open a PR instead of pushing directly, or branch protection must allow the `github-actions[bot]` to push.
- `commit-and-tag-version` relies on conventional commit messages. If commits do not follow the convention, the generated changelog will be sparse.
- The first release requires manually creating and pushing the `release` branch.

## Alternatives considered

- **Branch-merge trigger** (publish on every merge to `main`): Rejected because it removes explicit version control and can lead to accidental publishes.
- **Fully CI-driven release** (workflow_dispatch with version input): Rejected because it gives CI write access to the repository and increases token scope.
- **changesets**: Rejected for a single-package repository because it adds the overhead of changeset files without meaningful benefit.
