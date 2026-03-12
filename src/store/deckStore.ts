import { create } from 'zustand';
import { Card, CARD_DATABASE } from '../types/cards';

interface DeckState {
  deck: Card[];
  deckSize: {
    max: number;
    min: number;
  };
}

interface HandState {
  hand: {
    cards: Card[];
    maxHandSize: number;
  };
}

interface DeckActions {
  initializeDeck: (startingCards: string[]) => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  shuffleDeck: () => void;
  resetDeck: () => void;
  upgradeCard: (cardId: string) => void;
  // Hand actions
  drawCards: (amount: number) => void;
  discardCard: (cardId: string) => void;
  clearHand: () => void;
}

// Getter interface for external access
interface DeckGetters {
  cards: Card[];
}

const initialDeckState: DeckState = {
  deck: [],
  deckSize: {
    max: 20,
    min: 10,
  },
};

const initialHandState: HandState = {
  hand: {
    cards: [],
    maxHandSize: 5,
  },
};

export const useDeckStore = create<DeckState & HandState & DeckActions & DeckGetters>((set, get) => ({
  ...initialDeckState,
  ...initialHandState,

  // Getter for cards
  get cards() {
    return get().deck;
  },

  initializeDeck: (startingCards) => {
    const cards = startingCards.map((cardId, index) => {
      const cardData = CARD_DATABASE[cardId];
      return {
        id: `${cardId}-start-${index}-${Date.now()}`,
        ...cardData,
        level: 1,
      } as Card;
    });
    set({ deck: cards });
  },

  addCard: (card) => {
    set((state) => {
      if (state.deck.length >= state.deckSize.max) return state;
      return { deck: [...state.deck, card] };
    });
  },

  removeCard: (cardId) => {
    set((state) => ({
      deck: state.deck.filter((c) => c.id !== cardId),
    }));
  },

  shuffleDeck: () => {
    set((state) => {
      const shuffled = [...state.deck].sort(() => Math.random() - 0.5);
      return { deck: shuffled };
    });
  },

  resetDeck: () => {
    set(initialDeckState);
  },

  upgradeCard: (cardId) => {
    set((state) => ({
      deck: state.deck.map((c) =>
        c.id === cardId ? { ...c, level: Math.min(c.level + 1, c.maxLevel) } : c
      ),
    }));
  },

  // Hand actions
  drawCards: (amount) => {
    set((state) => {
      const deckRemaining = [...state.deck];
      const newHandCards: Card[] = [];

      // Draw cards from deck to hand
      for (let i = 0; i < amount && deckRemaining.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * deckRemaining.length);
        newHandCards.push(deckRemaining[randomIndex]);
        deckRemaining.splice(randomIndex, 1);
      }

      return {
        deck: deckRemaining,
        hand: {
          ...state.hand,
          cards: [...state.hand.cards, ...newHandCards],
        },
      };
    });
  },

  discardCard: (cardId) => {
    set((state) => ({
      hand: {
        ...state.hand,
        cards: state.hand.cards.filter((c) => c.id !== cardId),
      },
    }));
  },

  clearHand: () => {
    set((state) => ({
      hand: {
        ...state.hand,
        cards: [],
      },
    }));
  },
}));
