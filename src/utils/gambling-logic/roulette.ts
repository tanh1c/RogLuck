// European Roulette Logic (Single Zero)
// Numbers 0-36, with 0 being green, and 1-36 alternating red/black

export type BetType = 'number' | 'color' | 'even_odd' | 'high_low';
export type BetColor = 'red' | 'black' | 'green';
export type EvenOdd = 'even' | 'odd';
export type HighLow = 'high' | 'low';

export interface RouletteBet {
  type: BetType;
  value: number | BetColor | EvenOdd | HighLow;
  amount: number;
}

export interface RouletteResult {
  number: number;
  color: BetColor;
  isEven: boolean;
  isHigh: boolean;
}

// Red numbers on European roulette wheel
const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18,
  19, 21, 23, 25, 27, 30, 32, 34, 36
]);

/**
 * Get the color of a number on the roulette wheel
 * 0 = green, rest alternate red/black
 */
export function getNumberColor(num: number): BetColor {
  if (num === 0) return 'green';
  return RED_NUMBERS.has(num) ? 'red' : 'black';
}

/**
 * Check if a number is even (0 is not considered even for betting purposes)
 */
export function isEvenNumber(num: number): boolean {
  return num !== 0 && num % 2 === 0;
}

/**
 * Check if a number is high (19-36) or low (1-18)
 * 0 is neither high nor low
 */
export function isHighNumber(num: number): boolean {
  return num >= 19 && num <= 36;
}

/**
 * Spin the roulette wheel and return a random number 0-36
 */
export function spin(): number {
  return Math.floor(Math.random() * 37);
}

/**
 * Get the full result of a spin including number, color, and properties
 */
export function getSpinResult(number: number): RouletteResult {
  return {
    number,
    color: getNumberColor(number),
    isEven: isEvenNumber(number),
    isHigh: isHighNumber(number),
  };
}

/**
 * Calculate winnings based on the result and placed bets
 * Payouts:
 * - Straight bet (number): 35:1
 * - Color bet: 1:1
 * - Even/Odd: 1:1
 * - High/Low: 1:1
 */
export function calculateWinnings(result: number, bets: RouletteBet[]): {
  totalWinnings: number;
  winningBets: Array<{ bet: RouletteBet; winnings: number }>;
} {
  const result_data = getSpinResult(result);
  const winningBets: Array<{ bet: RouletteBet; winnings: number }> = [];
  let totalWinnings = 0;

  for (const bet of bets) {
    let isWin = false;
    let payout = 0;

    switch (bet.type) {
      case 'number':
        // Straight bet - pays 35:1
        if (bet.value === result) {
          isWin = true;
          payout = bet.amount * 35;
        }
        break;

      case 'color':
        // Color bet - pays 1:1
        if (bet.value === result_data.color) {
          isWin = true;
          payout = bet.amount * 1;
        }
        break;

      case 'even_odd':
        // Even/Odd bet - pays 1:1
        if (bet.value === 'even' && result_data.isEven) {
          isWin = true;
          payout = bet.amount * 1;
        } else if (bet.value === 'odd' && !result_data.isEven && result !== 0) {
          isWin = true;
          payout = bet.amount * 1;
        }
        break;

      case 'high_low':
        // High/Low bet - pays 1:1
        if (bet.value === 'high' && result_data.isHigh) {
          isWin = true;
          payout = bet.amount * 1;
        } else if (bet.value === 'low' && !result_data.isHigh && result !== 0) {
          isWin = true;
          payout = bet.amount * 1;
        }
        break;
    }

    if (isWin) {
      // Return original bet plus winnings
      const totalWinAmount = bet.amount + payout;
      winningBets.push({ bet, winnings: totalWinAmount });
      totalWinnings += totalWinAmount;
    }
  }

  return { totalWinnings, winningBets };
}

/**
 * Get all red numbers
 */
export function getRedNumbers(): number[] {
  return Array.from(RED_NUMBERS).sort((a, b) => a - b);
}

/**
 * Get all black numbers
 */
export function getBlackNumbers(): number[] {
  const allNumbers = Array.from({ length: 37 }, (_, i) => i);
  return allNumbers.filter(n => n !== 0 && !RED_NUMBERS.has(n));
}

/**
 * Validate if a bet is valid
 */
export function isValidBet(bet: RouletteBet): boolean {
  if (bet.amount <= 0) return false;

  switch (bet.type) {
    case 'number':
      return typeof bet.value === 'number' && bet.value >= 0 && bet.value <= 36;
    case 'color':
      return bet.value === 'red' || bet.value === 'black' || bet.value === 'green';
    case 'even_odd':
      return bet.value === 'even' || bet.value === 'odd';
    case 'high_low':
      return bet.value === 'high' || bet.value === 'low';
    default:
      return false;
  }
}
