import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Vestaboard } from '../src/Vestaboard';

describe('Vestaboard', () => {
  it('renders slots for each character', () => {
    render(<Vestaboard value="HI" columns={4} />);
    const slots = screen
      .getAllByRole('generic', { hidden: true })
      .filter((el) => el.className.includes('flipSlot'));
    expect(slots).toHaveLength(4);
  });

  it('announces the value via an aria-live region', () => {
    render(<Vestaboard value="TEST" />);
    const announcer = screen.getByText('TEST');
    expect(announcer).toHaveAttribute('aria-live', 'polite');
  });

  it('pads shorter strings to the column count', () => {
    render(<Vestaboard value="A" columns={5} />);
    const slots = screen
      .getAllByRole('generic', { hidden: true })
      .filter((el) => el.className.includes('flipSlot'));
    expect(slots).toHaveLength(5);
  });
});
