const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = ALPHABET.length;

export function sortOrderKeys(a: string, b: string) {
  return a < b ? -1 : 1;
}

function charToIndex(c: string): number {
  return ALPHABET.indexOf(c);
}

function indexToChar(i: number): string {
  return ALPHABET[i];
}

export function generateOrderKeyBetween(left: string | null, right: string | null): string {
  let i = 0;
  let result = '';

  while (true) {
    const leftChar = left?.[i];
    const rightChar = right?.[i];

    const leftIndex = leftChar ? charToIndex(leftChar) : 0;
    const rightIndex = rightChar ? charToIndex(rightChar) : BASE - 1;

    if (rightIndex - leftIndex > 1) {
      const mid = Math.floor((leftIndex + rightIndex) / 2);
      result += indexToChar(mid);
      return result;
    }

    result += indexToChar(leftIndex);
    i++;
  }
}
