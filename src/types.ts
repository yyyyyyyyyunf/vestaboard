import type { CSSProperties } from 'react';

export interface FlipSlotProps {
  /** Current character to display. Should be a single character. */
  value: string;
  /** Ordered set of characters the slot can cycle through. Defaults to alphanumeric + space + common punctuation. */
  characters?: string;
  /** Whether the slot wraps around the character set when flipping forward. Default true. */
  loop?: boolean;
  /** Duration (in seconds) of the meta time-scrub animation. Scales with distance. */
  duration?: number;
  /** GSAP ease applied to the time scrub. Default 'power1.out'. */
  ease?: string;
  /** Extra full cycles through the character set. Useful for stagger effects. Default 0. */
  pad?: number;
  /** Called when a flip animation starts. */
  onStart?: () => void;
  /** Called when a flip animation completes. */
  onEnd?: () => void;
  /** Additional CSS class for the root element. */
  className?: string;
  /** Additional inline styles for the root element. */
  style?: CSSProperties;
}

export interface VestaboardProps extends Omit<
  FlipSlotProps,
  'value' | 'pad' | 'onStart' | 'onEnd'
> {
  /** String to display on the board. */
  value: string;
  /** Number of columns in the board. Default value.length. */
  columns?: number;
  /** Number of rows in the board. Default 1. */
  rows?: number;
  /** Delay wave between adjacent columns, expressed as extra pad loops. Default 0. */
  stagger?: number;
  /** How to align shorter strings: 'left' | 'center' | 'right'. Default 'left'. */
  align?: 'left' | 'center' | 'right';
  /** Called when any slot starts flipping. */
  onStart?: () => void;
  /** Called when all slots have settled. */
  onEnd?: () => void;
}
