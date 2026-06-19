import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlipSlot } from '../src/FlipSlot';

const mockTo = vi.fn(() => ({
  kill: vi.fn(),
}));

const mockTimeline = vi.fn(() => ({
  to: vi.fn().mockReturnThis(),
  totalTime: vi.fn(),
  totalDuration: vi.fn().mockReturnValue(10),
  kill: vi.fn(),
}));

vi.mock('../src/utils/gsap', () => ({
  gsap: {
    timeline: (...args: unknown[]) => mockTimeline(...args),
    to: (...args: unknown[]) => mockTo(...args),
  },
  isBrowser: () => true,
}));

describe('FlipSlot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders four face elements', () => {
    render(<FlipSlot value="A" />);
    const faces = screen
      .getAllByRole('generic', { hidden: true })
      .filter((el) => el.className.includes('face'));
    expect(faces).toHaveLength(4);
  });

  it('renders the initial character on the fold faces', () => {
    render(<FlipSlot value="A" />);
    const faces = screen
      .getAllByRole('generic', { hidden: true })
      .filter((el) => el.className.includes('face'));
    const texts = faces.map((el) => el.textContent);
    expect(texts).toContain('A');
  });
});
