import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CHARACTERS,
  normalizeCharacter,
  characterIndex,
  wrapForwardDistance,
  computeShift,
} from '../src/utils/chars';

describe('normalizeCharacter', () => {
  it('returns the first character of a string', () => {
    expect(normalizeCharacter('AB')).toBe('A');
  });

  it('returns a space for an empty string', () => {
    expect(normalizeCharacter('')).toBe(' ');
  });

  it('preserves emoji as a single character', () => {
    expect(normalizeCharacter('🍎')).toBe('🍎');
  });
});

describe('characterIndex', () => {
  it('returns the index of a character in the set', () => {
    expect(characterIndex('A', DEFAULT_CHARACTERS)).toBeGreaterThan(0);
  });

  it('returns 0 for missing characters', () => {
    expect(characterIndex('🍎', DEFAULT_CHARACTERS)).toBe(0);
  });
});

describe('wrapForwardDistance', () => {
  it('returns direct forward distance', () => {
    expect(wrapForwardDistance(0, 3, 10, true)).toBe(3);
  });

  it('wraps around when looping', () => {
    expect(wrapForwardDistance(7, 2, 10, true)).toBe(5);
  });

  it('does not wrap when looping is disabled', () => {
    expect(wrapForwardDistance(7, 2, 10, false)).toBe(2);
  });

  it('returns 0 when indices are equal', () => {
    expect(wrapForwardDistance(5, 5, 10, true)).toBe(0);
  });
});

describe('computeShift', () => {
  it('adds pad loops to the base shift', () => {
    expect(computeShift(0, 1, 10, true, 1)).toBe(11);
  });

  it('performs a full loop when indices match and pad is set', () => {
    expect(computeShift(3, 3, 10, true, 1)).toBe(10);
  });

  it('returns 0 when already at target and no pad', () => {
    expect(computeShift(3, 3, 10, true, 0)).toBe(0);
  });
});
