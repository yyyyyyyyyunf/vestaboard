const DEFAULT_CHARACTERS_STRING =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -:.';

export const DEFAULT_CHARACTERS = Array.from(DEFAULT_CHARACTERS_STRING);

export function normalizeCharacter(value: string): string {
  const chars = Array.from(value);
  if (chars.length === 0) return ' ';
  if (chars.length > 1) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(
        `FlipSlot value should be a single character, received "${value}". Using first character.`
      );
    }
  }
  return chars[0];
}

export function characterIndex(char: string, characters: string[]): number {
  const index = characters.indexOf(char);
  return index === -1 ? 0 : index;
}

export function wrapForwardDistance(
  currentIndex: number,
  desiredIndex: number,
  length: number,
  loop: boolean
): number {
  if (length <= 1) return 0;

  const rawShift = (desiredIndex - currentIndex + length) % length;

  if (!loop) {
    // When not looping, sweep forward to the end of the character set and stop.
    // If the target is behind, travel to the end.
    return rawShift === 0 ? 0 : desiredIndex >= currentIndex ? rawShift : length - 1 - currentIndex;
  }

  return rawShift;
}

export function computeShift(
  currentIndex: number,
  desiredIndex: number,
  length: number,
  loop: boolean,
  pad: number
): number {
  const baseShift = wrapForwardDistance(currentIndex, desiredIndex, length, loop);

  if (baseShift === 0) {
    return pad > 0 ? pad * length : 0;
  }

  return baseShift + pad * length;
}
