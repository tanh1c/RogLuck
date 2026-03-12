export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface BlackjackCard {
  suit: Suit;
  rank: Rank;
  value: number;
}

export function createDeck(): BlackjackCard[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const deck: BlackjackCard[] = [];
  ranks.forEach((rank) => {
    suits.forEach((suit) => {
      let value: number;
      if (['J', 'Q', 'K'].includes(rank)) {
        value = 10;
      } else if (rank === 'A') {
        value = 11;
      } else {
        value = parseInt(rank);
      }
      deck.push({ suit, rank, value });
    });
  });

  return deck;
}

export function shuffleDeck(deck: BlackjackCard[]): BlackjackCard[] {
  return [...deck].sort(() => Math.random() - 0.5);
}

export function calculateHand(hand: BlackjackCard[]): number {
  let total = hand.reduce((sum, card) => sum + card.value, 0);
  let aces = hand.filter((card) => card.rank === 'A').length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

export function isBust(hand: BlackjackCard[]): boolean {
  return calculateHand(hand) > 21;
}

export function isBlackjack(hand: BlackjackCard[]): boolean {
  return hand.length === 2 && calculateHand(hand) === 21;
}

export function determineWinner(playerHand: BlackjackCard[], dealerHand: BlackjackCard[]): 'player' | 'dealer' | 'tie' {
  const playerTotal = calculateHand(playerHand);
  const dealerTotal = calculateHand(dealerHand);

  if (playerTotal > 21) return 'dealer';
  if (dealerTotal > 21) return 'player';
  if (playerTotal > dealerTotal) return 'player';
  if (dealerTotal > playerTotal) return 'dealer';
  return 'tie';
}
