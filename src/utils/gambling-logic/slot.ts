// Slot Machine Logic
// Classic 3-reel slot machine with various symbols

export type SlotSymbol = 'cherry' | 'lemon' | 'orange' | 'plum' | 'bell' | 'star' | 'seven';

export interface SlotResult {
  reels: SlotSymbol[];
  winnings: number;
}

// Symbol values (base payout for 3 matching)
export const SYMBOL_VALUES: Record<SlotSymbol, number> = {
  cherry: 2,
  lemon: 3,
  orange: 5,
  plum: 10,
  bell: 20,
  star: 50,
  seven: 100,
};

// Symbol display characters (pixel art style)
export const SYMBOL_CHARS: Record<SlotSymbol, string> = {
  cherry: '🍒',
  lemon: '🍋',
  orange: '🍊',
  plum: '🫐',
  bell: '🔔',
  star: '⭐',
  seven: '7️⃣',
};

// All symbols in order (for reel display)
export const ALL_SYMBOLS: SlotSymbol[] = [
  'cherry',
  'lemon',
  'orange',
  'plum',
  'bell',
  'star',
  'seven',
];

/**
 * Get random symbol weighted by rarity
 * Higher value symbols are rarer
 */
export function getRandomSymbol(): SlotSymbol {
  const rand = Math.random();

  // Weighted probabilities:
  // cherry: 30%, lemon: 25%, orange: 20%, plum: 15%, bell: 7%, star: 2%, seven: 1%
  if (rand < 0.30) return 'cherry';
  if (rand < 0.55) return 'lemon';
  if (rand < 0.75) return 'orange';
  if (rand < 0.90) return 'plum';
  if (rand < 0.97) return 'bell';
  if (rand < 0.99) return 'star';
  return 'seven';
}

/**
 * Spin all 3 reels and return result
 */
export function spin(): SlotResult {
  const reels: SlotSymbol[] = [
    getRandomSymbol(),
    getRandomSymbol(),
    getRandomSymbol(),
  ];

  const winnings = calculateWinnings(reels);

  return { reels, winnings };
}

/**
 * Calculate winnings based on reel symbols
 * Payouts:
 * - 3 matching: symbol_value x bet
 * - 2 matching: symbol_value / 2 x bet
 * - Mixed 7s: special bonus (not applicable with single seven type)
 */
export function calculateWinnings(reels: SlotSymbol[]): number {
  const [reel1, reel2, reel3] = reels;

  // Check for 3 matching
  if (reel1 === reel2 && reel2 === reel3) {
    return SYMBOL_VALUES[reel1];
  }

  // Check for 2 matching
  if (reel1 === reel2) {
    return Math.floor(SYMBOL_VALUES[reel1] / 2);
  }
  if (reel2 === reel3) {
    return Math.floor(SYMBOL_VALUES[reel2] / 2);
  }
  if (reel1 === reel3) {
    return Math.floor(SYMBOL_VALUES[reel1] / 2);
  }

  // No match - no win
  return 0;
}

/**
 * Get winning line description
 */
export function getWinDescription(reels: SlotSymbol[]): string {
  const [reel1, reel2, reel3] = reels;

  if (reel1 === reel2 && reel2 === reel3) {
    return `🎉 Triple ${SYMBOL_CHARS[reel1]}!`;
  }

  if (reel1 === reel2) {
    return `✨ Double ${SYMBOL_CHARS[reel1]}!`;
  }
  if (reel2 === reel3) {
    return `✨ Double ${SYMBOL_CHARS[reel2]}!`;
  }
  if (reel1 === reel3) {
    return `✨ Double ${SYMBOL_CHARS[reel1]}!`;
  }

  return 'No win';
}

/**
 * Check if the result is a win
 */
export function isWin(reels: SlotSymbol[]): boolean {
  return calculateWinnings(reels) > 0;
}

/**
 * Get the symbol at a specific index in the visual reel order
 * Used for scrolling animation
 */
export function getSymbolAtIndex(index: number): SlotSymbol {
  const normalizedIndex = ((index % ALL_SYMBOLS.length) + ALL_SYMBOLS.length) % ALL_SYMBOLS.length;
  return ALL_SYMBOLS[normalizedIndex];
}

/**
 * Get the display index of a symbol
 */
export function getSymbolIndex(symbol: SlotSymbol): number {
  return ALL_SYMBOLS.indexOf(symbol);
}
