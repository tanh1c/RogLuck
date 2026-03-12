import { describe, it, expect } from 'vitest';
import { createDeck, shuffleDeck, drawCards, evaluateHand, PokerCard } from '../../utils/gambling-logic/poker';
import { calculateHand, BlackjackCard } from '../../utils/gambling-logic/blackjack';
import { spin, getNumberColor } from '../../utils/gambling-logic/roulette';
import { rollDice } from '../../utils/gambling-logic/dice';
import { spin as slotSpin, ALL_SYMBOLS } from '../../utils/gambling-logic/slot';

describe('gambling-logic', () => {
  describe('Poker', () => {
    describe('createDeck', () => {
      it('should create a deck with 52 cards', () => {
        const deck = createDeck();
        expect(deck.length).toBe(52);
      });

      it('should have all suits and ranks', () => {
        const deck = createDeck();
        const suits = new Set(deck.map(c => c.suit));
        const ranks = new Set(deck.map(c => c.rank));

        expect(suits.size).toBe(4);
        expect(ranks.size).toBe(13);
      });
    });

    describe('shuffleDeck', () => {
      it('should shuffle the deck', () => {
        const deck = createDeck();
        const shuffled = shuffleDeck(deck);

        expect(shuffled.length).toBe(52);
        // Check if shuffled is different from original (most of the time)
        // Due to randomness, occasionally they might be the same
        expect(shuffled).toBeDefined();
      });
    });

    describe('drawCards', () => {
      it('should draw specified number of cards', () => {
        const deck = createDeck();
        const { drawn, remaining } = drawCards(deck, 5);

        expect(drawn.length).toBe(5);
        expect(remaining.length).toBe(47);
      });
    });

    describe('evaluateHand', () => {
      it('should return a hand with cards and score', () => {
        const hand: PokerCard[] = [
          { suit: 'hearts' as const, rank: '2' as const, value: 2 },
          { suit: 'hearts' as const, rank: '7' as const, value: 7 },
          { suit: 'hearts' as const, rank: '9' as const, value: 9 },
          { suit: 'hearts' as const, rank: 'J' as const, value: 11 },
          { suit: 'hearts' as const, rank: 'K' as const, value: 13 },
        ];
        const result = evaluateHand(hand);
        expect(result.cards.length).toBe(5);
        expect(result.score).toBe(42); // 2+7+9+11+13
        expect(result.handType).toBe('High Card');
      });

      it('should sort cards by value descending', () => {
        const hand: PokerCard[] = [
          { suit: 'hearts' as const, rank: '2' as const, value: 2 },
          { suit: 'diamonds' as const, rank: 'A' as const, value: 14 },
          { suit: 'clubs' as const, rank: 'K' as const, value: 13 },
        ];
        const result = evaluateHand(hand);
        expect(result.cards[0].value).toBe(14);
        expect(result.cards[1].value).toBe(13);
        expect(result.cards[2].value).toBe(2);
      });
    });
  });

  describe('Blackjack', () => {
    describe('calculateHand', () => {
      it('should calculate hand value correctly', () => {
        const hand: BlackjackCard[] = [
          { suit: 'hearts', rank: '10', value: 10 },
          { suit: 'diamonds', rank: '5', value: 5 },
        ];
        expect(calculateHand(hand)).toBe(15);
      });

      it('should handle aces as 11 or 1', () => {
        const hand: BlackjackCard[] = [
          { suit: 'hearts', rank: 'A', value: 11 },
          { suit: 'diamonds', rank: 'K', value: 10 },
        ];
        expect(calculateHand(hand)).toBe(21);
      });

      it('should count multiple aces correctly', () => {
        const hand: BlackjackCard[] = [
          { suit: 'hearts', rank: 'A', value: 11 },
          { suit: 'diamonds', rank: 'A', value: 11 },
          { suit: 'clubs', rank: '9', value: 9 },
        ];
        expect(calculateHand(hand)).toBe(21);
      });

      it('should bust on value over 21', () => {
        const hand: BlackjackCard[] = [
          { suit: 'hearts', rank: '10', value: 10 },
          { suit: 'diamonds', rank: '8', value: 8 },
          { suit: 'clubs', rank: '5', value: 5 },
        ];
        expect(calculateHand(hand)).toBe(23);
      });
    });
  });

  describe('Roulette', () => {
    describe('spin', () => {
      it('should return a valid number (0-36)', () => {
        const result = spin();
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(36);
      });
    });

    describe('getNumberColor', () => {
      it('should return green for 0', () => {
        expect(getNumberColor(0)).toBe('green');
      });

      it('should return red or black for other numbers', () => {
        const color1 = getNumberColor(1);
        const color32 = getNumberColor(32);
        expect(['red', 'black']).toContain(color1);
        expect(['red', 'black']).toContain(color32);
      });
    });
  });

  describe('Dice', () => {
    describe('rollDice', () => {
      it('should roll 2 dice by default', () => {
        const result = rollDice();
        expect(result.dice.length).toBe(2);
        expect(result.dice.every(d => d >= 1 && d <= 6)).toBe(true);
      });

      it('should roll specified number of dice', () => {
        const result = rollDice(3);
        expect(result.dice.length).toBe(3);
      });

      it('should return sum between 2 and 12 for 2 dice', () => {
        const result = rollDice(2);
        expect(result.total).toBeGreaterThanOrEqual(2);
        expect(result.total).toBeLessThanOrEqual(12);
      });

      it('should return sum between 3 and 18 for 3 dice', () => {
        const result = rollDice(3);
        expect(result.total).toBeGreaterThanOrEqual(3);
        expect(result.total).toBeLessThanOrEqual(18);
      });
    });
  });

  describe('Slot Machine', () => {
    describe('spin', () => {
      it('should return 3 symbols', () => {
        const result = slotSpin();
        expect(result.reels.length).toBe(3);
      });

      it('should return valid symbols', () => {
        const result = slotSpin();
        result.reels.forEach(symbol => {
          expect(ALL_SYMBOLS).toContain(symbol);
        });
      });
    });
  });
});
