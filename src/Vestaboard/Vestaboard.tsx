import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { FlipSlot } from '../FlipSlot';
import { normalizeCharacter } from '../utils/chars';
import type { VestaboardProps } from '../types';
import styles from './Vestaboard.module.css';

function padString(value: string, length: number, align: 'left' | 'center' | 'right'): string[] {
  const chars = Array.from(value).map(normalizeCharacter);

  if (chars.length >= length) {
    return chars.slice(0, length);
  }

  const padding = length - chars.length;
  const leftPad = align === 'center' ? Math.floor(padding / 2) : align === 'right' ? padding : 0;
  const rightPad = padding - leftPad;

  return [...Array(leftPad).fill(' '), ...chars, ...Array(rightPad).fill(' ')];
}

export function Vestaboard({
  value,
  columns,
  rows = 1,
  stagger = 0,
  align = 'left',
  onStart,
  onEnd,
  className = '',
  style,
  ...slotProps
}: VestaboardProps) {
  const slotsRef = useRef(0);
  const completedRef = useRef(0);
  const [announcedValue, setAnnouncedValue] = useState(value);

  const resolvedColumns = columns ?? (Array.from(value).length || 1);
  const capacity = resolvedColumns * rows;

  const gridChars = useMemo(() => {
    const normalized = Array.from(value).map(normalizeCharacter);
    const flat = normalized.slice(0, capacity);

    if (flat.length < capacity) {
      return padString(value, capacity, align);
    }

    return flat;
  }, [value, capacity, align]);

  const slots = useMemo(() => {
    return gridChars.map((char, index) => {
      const columnIndex = index % resolvedColumns;
      // Higher pad for earlier columns creates a left-to-right wave.
      const pad = stagger > 0 ? (resolvedColumns - 1 - columnIndex) * stagger : 0;

      return {
        key: index,
        char,
        pad,
      };
    });
  }, [gridChars, resolvedColumns, stagger]);

  useEffect(() => {
    slotsRef.current = slots.length;
    completedRef.current = 0;

    if (slots.length === 0) {
      onEnd?.();
      setAnnouncedValue(value);
    }
  }, [slots.length, onEnd, value]);

  const handleSlotStart = useCallback(() => {
    if (completedRef.current === 0) {
      onStart?.();
    }
  }, [onStart]);

  const handleSlotEnd = useCallback(() => {
    completedRef.current += 1;

    if (completedRef.current >= slotsRef.current) {
      setAnnouncedValue(value);
      onEnd?.();
    }
  }, [onEnd, value]);

  return (
    <div className={`${styles.vestaboard} ${className}`} style={style}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${resolvedColumns}, minmax(0, auto))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, auto))`,
        }}
        aria-hidden="true"
      >
        {slots.map(({ key, char, pad }) => (
          <FlipSlot
            key={key}
            value={char}
            pad={pad}
            onStart={handleSlotStart}
            onEnd={handleSlotEnd}
            {...slotProps}
          />
        ))}
      </div>
      <div className={styles.announcer} aria-live="polite" aria-atomic="true">
        {announcedValue}
      </div>
    </div>
  );
}
