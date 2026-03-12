// Dice (Craps-style) Logic
// Uses 2d6 for most bets, with various betting options

export type BetType = 'sum' | 'specific_number' | 'over_under' | 'exact_total';
export type SumBet = 'high' | 'low';
export type OverUnder = 'over' | 'under';

export interface DiceRoll {
  dice: number[];
  total: number;
}

export interface DiceBet {
  type: BetType;
  value: SumBet | number | OverUnder;
  amount: number;
}

/**
 * Roll specified number of d6 dice
 * @param count - Number of dice to roll (default: 2)
 * @returns DiceRoll with individual dice and total
 */
export function rollDice(count: number = 2): DiceRoll {
  const dice: number[] = [];
  for (let i = 0; i < count; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1);
  }
  return {
    dice,
    total: dice.reduce((sum, die) => sum + die, 0),
  };
}

/**
 * Calculate winnings based on roll, bet type, and bet value
 * Payouts:
 * - Sum bet (high 11+/low 2-10): 1:1
 * - Specific number (1-6 appears): 1:1 per match
 * - Over/Under 10.5: 1:1
 * - Exact total (2-12): varies by rarity
 */
export function calculateWinnings(roll: DiceRoll, bets: DiceBet[]): {
  totalWinnings: number;
  winningBets: Array<{ bet: DiceBet; winnings: number }>;
} {
  const winningBets: Array<{ bet: DiceBet; winnings: number }> = [];
  let totalWinnings = 0;

  for (const bet of bets) {
    let isWin = false;
    let payout = 0;

    switch (bet.type) {
      case 'sum': {
        // High (11-12) or Low (2-10) bet - pays 1:1
        const sumValue = bet.value as SumBet;
        if (sumValue === 'high' && roll.total >= 11) {
          isWin = true;
          payout = bet.amount * 1;
        } else if (sumValue === 'low' && roll.total <= 10) {
          isWin = true;
          payout = bet.amount * 1;
        }
        break;
      }

      case 'specific_number': {
        // Specific number (1-6) appears in any die - pays 1:1 per match
        const numberValue = bet.value as number;
        const matches = roll.dice.filter(die => die === numberValue).length;
        if (matches > 0) {
          isWin = true;
          // 1:1 per matching die
          payout = bet.amount * matches;
        }
        break;
      }

      case 'over_under': {
        // Over (11-12) or Under (2-10) 10.5 - pays 1:1
        const ouValue = bet.value as OverUnder;
        if (ouValue === 'over' && roll.total > 10) {
          isWin = true;
          payout = bet.amount * 1;
        } else if (ouValue === 'under' && roll.total < 11) {
          isWin = true;
          payout = bet.amount * 1;
        }
        break;
      }

      case 'exact_total': {
        // Exact total bet - payout varies by rarity
        const exactValue = bet.value as number;
        if (roll.total === exactValue) {
          isWin = true;
          // Rarity-based payouts (based on probability of rolling each total with 2d6)
          const rarityPayouts: Record<number, number> = {
            2: 10,  // 1/36 chance
            3: 6,   // 2/36 chance
            4: 4,   // 3/36 chance
            5: 3,   // 4/36 chance
            6: 2,   // 5/36 chance
            7: 2,   // 6/36 chance (most common)
            8: 2,   // 5/36 chance
            9: 3,   // 4/36 chance
            10: 4,  // 3/36 chance
            11: 6,  // 2/36 chance
            12: 10, // 1/36 chance
          };
          payout = bet.amount * (rarityPayouts[exactValue] || 1);
        }
        break;
      }
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
 * Validate if a bet is valid
 */
export function isValidBet(bet: DiceBet): boolean {
  if (bet.amount <= 0) return false;

  switch (bet.type) {
    case 'sum':
      return bet.value === 'high' || bet.value === 'low';
    case 'specific_number':
      return typeof bet.value === 'number' && bet.value >= 1 && bet.value <= 6;
    case 'over_under':
      return bet.value === 'over' || bet.value === 'under';
    case 'exact_total':
      return typeof bet.value === 'number' && bet.value >= 2 && bet.value <= 12;
    default:
      return false;
  }
}

/**
 * Get the probability of each exact total (for display purposes)
 */
export function getTotalProbabilities(): Record<number, string> {
  return {
    2: '2.8%',   // 1/36
    3: '5.6%',   // 2/36
    4: '8.3%',   // 3/36
    5: '11.1%',  // 4/36
    6: '13.9%',  // 5/36
    7: '16.7%',  // 6/36
    8: '13.9%',  // 5/36
    9: '11.1%',  // 4/36
    10: '8.3%',  // 3/36
    11: '5.6%',  // 2/36
    12: '2.8%',  // 1/36
  };
}

/**
 * Get payout multiplier for exact total
 */
export function getExactTotalPayout(total: number): number {
  const rarityPayouts: Record<number, number> = {
    2: 10,
    3: 6,
    4: 4,
    5: 3,
    6: 2,
    7: 2,
    8: 2,
    9: 3,
    10: 4,
    11: 6,
    12: 10,
  };
  return rarityPayouts[total] || 1;
}
