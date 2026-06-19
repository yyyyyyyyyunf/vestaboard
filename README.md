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
