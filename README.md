# @fly4react/vestaboard

A React split-flap display component inspired by Vestaboard, built with GSAP and CSS Modules.

## Install

```bash
pnpm add @fly4react/vestaboard gsap react react-dom
```

`gsap`, `react`, and `react-dom` are peer dependencies.

## Usage

```tsx
import { Vestaboard, FlipSlot } from '@fly4react/vestaboard';

// Full board
<Vestaboard value="HELLO" columns={10} stagger={0.5} duration={0.4} />

// Single slot
<FlipSlot value="A" />
```

Styles are automatically imported when the package is bundled with Vite, webpack, or Rollup. If you consume the ESM/CJS files directly without a bundler, import the CSS manually:

```tsx
import '@fly4react/vestaboard/dist/index.css';
```

## Customization

CSS custom properties exposed by each slot:

```css
.flipSlot {
  --vesta-bg: #1a1a1a;
  --vesta-color: #f5f5f5;
  --vesta-font-size: 2rem;
  --vesta-radius: 0.25rem;
  --vesta-axle-color: #333333;
}
```

## Development

```bash
pnpm install
pnpm dev      # start demo
pnpm test     # run tests
pnpm lint     # oxlint
pnpm format   # prettier
pnpm build    # build library
```

## Release

Releases are automated through GitHub Actions. To publish a new version:

1. Ensure your changes are on the `develop` branch and merged into `release`.
2. Check out the `release` branch locally:
   ```bash
   git checkout release
   git pull origin release
   ```
3. Run the release script:
   ```bash
   pnpm release patch        # 0.1.0 -> 0.1.1
   pnpm release minor        # 0.1.0 -> 0.2.0
   pnpm release major        # 0.1.0 -> 1.0.0
   pnpm release 0.2.0        # explicit version
   pnpm release 0.2.0-beta.0 # prerelease version
   ```
4. The script updates `package.json`, generates `CHANGELOG.md`, creates a `v*` tag, and pushes everything to `origin/release`.
5. GitHub Actions takes over: it runs CI checks, publishes to npm with provenance, creates a GitHub Release, and merges `release` back into `main`.

Preview the release without making changes:

```bash
pnpm release:dry patch
```
