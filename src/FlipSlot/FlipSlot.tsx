import { useEffect, useRef, useCallback } from 'react';
import { gsap, isBrowser } from '../utils/gsap';
import {
  DEFAULT_CHARACTERS,
  normalizeCharacter,
  characterIndex,
  computeShift,
} from '../utils/chars';
import type { FlipSlotProps } from '../types';
import styles from './FlipSlot.module.css';

const SEGMENT_DURATION = 1;

export function FlipSlot({
  value,
  characters: charactersProp = DEFAULT_CHARACTERS.join(''),
  loop = true,
  duration = 0.5,
  ease = 'power1.out',
  pad = 0,
  onStart,
  onEnd,
  className = '',
  style,
}: FlipSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unfoldTopRef = useRef<HTMLDivElement>(null);
  const unfoldBottomRef = useRef<HTMLDivElement>(null);
  const foldTopRef = useRef<HTMLDivElement>(null);
  const foldBottomRef = useRef<HTMLDivElement>(null);

  const charsRef = useRef<string[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrubberRef = useRef<gsap.core.Tween | null>(null);
  const animatingRef = useRef(false);
  const valueRef = useRef(value);

  // Keep ref in sync with latest prop value for initialization effects.
  valueRef.current = value;

  const setFaceText = useCallback((next: string, current: string) => {
    const unfoldTop = unfoldTopRef.current;
    const unfoldBottom = unfoldBottomRef.current;
    const foldTop = foldTopRef.current;
    const foldBottom = foldBottomRef.current;

    if (unfoldTop) unfoldTop.textContent = next;
    if (unfoldBottom) unfoldBottom.textContent = next;
    if (foldTop) foldTop.textContent = current;
    if (foldBottom) foldBottom.textContent = current;
  }, []);

  const buildTimeline = useCallback(() => {
    const container = containerRef.current;
    if (!container || !isBrowser()) return null;

    const chars = charsRef.current;
    const length = chars.length;

    const tl = gsap.timeline({
      paused: true,
      repeat: length - 1,
      onRepeat: () => {
        const index = Math.floor(tl.totalTime() / SEGMENT_DURATION) % length;
        const next = chars[(index + 1) % length];
        const current = chars[index % length];
        setFaceText(next, current);
      },
    });

    tl.to(container, {
      '--flipped': 180,
      duration: SEGMENT_DURATION,
      ease: 'none',
    });

    return tl;
  }, [setFaceText]);

  const buildScrubber = useCallback((timeline: gsap.core.Timeline) => {
    if (!isBrowser()) return null;

    return gsap.to(timeline, {
      totalTime: timeline.totalDuration(),
      repeat: -1,
      paused: true,
      duration: timeline.totalDuration(),
      ease: 'none',
    });
  }, []);

  const flipTo = useCallback(
    (desired: string) => {
      const chars = charsRef.current;
      const timeline = timelineRef.current;
      const scrubber = scrubberRef.current;
      const container = containerRef.current;

      if (!timeline || !scrubber || !container || chars.length === 0) return;

      const desiredIndex = characterIndex(desired, chars);
      const currentIndex = Math.floor(timeline.totalTime() / SEGMENT_DURATION) % chars.length;

      const shift = computeShift(currentIndex, desiredIndex, chars.length, loop, pad);

      if (shift === 0) {
        // Already at target; ensure faces are set correctly.
        setFaceText(chars[(desiredIndex + 1) % chars.length], chars[desiredIndex]);
        onEnd?.();
        return;
      }

      // Honor reduced motion preference.
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

      if (prefersReducedMotion) {
        scrubber.kill();
        timeline.totalTime(desiredIndex * SEGMENT_DURATION);
        setFaceText(chars[(desiredIndex + 1) % chars.length], chars[desiredIndex]);
        scrubberRef.current = buildScrubber(timeline);
        onEnd?.();
        return;
      }

      if (animatingRef.current) {
        // Interrupt any in-flight scrub animation and continue from here.
        scrubberRef.current?.kill();
        scrubberRef.current = buildScrubber(timeline);
      }

      animatingRef.current = true;
      onStart?.();

      const newScrubber = gsap.to(scrubberRef.current, {
        totalTime: `+=${shift}`,
        ease,
        duration: Math.max(0.1, shift * duration),
        onComplete: () => {
          animatingRef.current = false;
          onEnd?.();
        },
      });

      scrubberRef.current = newScrubber;
    },
    [buildScrubber, duration, ease, loop, onEnd, onStart, pad, setFaceText]
  );

  // Initialize timeline and scrubber when the character set changes.
  useEffect(() => {
    if (!isBrowser()) return;

    charsRef.current = Array.from(charactersProp);
    const timeline = buildTimeline();
    if (!timeline) return;

    timelineRef.current = timeline;

    const initialChar = normalizeCharacter(valueRef.current);
    const initialIndex = characterIndex(initialChar, charsRef.current);
    timeline.totalTime(initialIndex * SEGMENT_DURATION);
    setFaceText(
      charsRef.current[(initialIndex + 1) % charsRef.current.length],
      charsRef.current[initialIndex]
    );

    scrubberRef.current = buildScrubber(timeline);

    return () => {
      timeline.kill();
      scrubberRef.current?.kill();
    };
  }, [buildScrubber, buildTimeline, charactersProp, setFaceText]);

  // React to value changes.
  useEffect(() => {
    if (!timelineRef.current) return;
    const nextChar = normalizeCharacter(value);
    charsRef.current = Array.from(charactersProp);
    flipTo(nextChar);
  }, [charactersProp, flipTo, value]);

  return (
    <div
      ref={containerRef}
      className={`${styles.flipSlot} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <div className={`${styles.face} ${styles.unfoldTop}`} ref={unfoldTopRef} />
      <div className={`${styles.face} ${styles.unfoldBottom}`} ref={unfoldBottomRef} />
      <div className={`${styles.face} ${styles.foldTop}`} ref={foldTopRef} />
      <div className={`${styles.face} ${styles.foldBottom}`} ref={foldBottomRef} />
    </div>
  );
}
