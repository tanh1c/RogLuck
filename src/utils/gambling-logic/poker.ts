export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface PokerCard {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface PokerHand {
  cards: PokerCard[];
  score: number;
  handType: string;
}

export function createDeck(): PokerCard[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const deck: PokerCard[] = [];
  ranks.forEach((rank, index) => {
    suits.forEach((suit) => {
      deck.push({ suit, rank, value: index + 2 });
    });
  });

  return deck;
}

export function shuffleDeck(deck: PokerCard[]): PokerCard[] {
  return [...deck].sort(() => Math.random() - 0.5);
}

export function drawCards(deck: PokerCard[], count: number): { drawn: PokerCard[]; remaining: PokerCard[] } {
  const drawn = deck.slice(0, count);
  const remaining = deck.slice(count);
  return { drawn, remaining };
}

export function evaluateHand(cards: PokerCard[]): PokerHand {
  const sorted = [...cards].sort((a, b) => b.value - a.value);

  return {
    cards: sorted,
    score: sorted.reduce((sum, card) => sum + card.value, 0),
    handType: 'High Card',
  };
}

export function determineWinner(playerHand: PokerHand, enemyHand: PokerHand): 'player' | 'enemy' | 'tie' {
  if (playerHand.score > enemyHand.score) return 'player';
  if (enemyHand.score > playerHand.score) return 'enemy';
  return 'tie';
}
