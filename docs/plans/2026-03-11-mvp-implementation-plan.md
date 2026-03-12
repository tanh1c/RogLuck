# Dungeon Casino Rogue - MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Xây dựng MVP web game roguelike + gambling với pixel art style, 1 character class, 2 gambling games, basic deck-building, và save/load system.

**Architecture:** React component-based architecture với Zustand state management, Tailwind CSS styling, pixel art fonts, localStorage persistence. Single-player offline-first design với 16-bit pixel art aesthetic.

**Tech Stack:** React 18 + TypeScript, Tailwind CSS, Google Fonts (Press Start 2P), Zustand, Framer Motion (pixel-perfect animations), localStorage/IndexedDB

---

## Phase 1: Project Setup & Infrastructure

### Task 1: Initialize React + TypeScript Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

**Step 1: Create project with Vite**

```bash
npm create vite@latest . -- --template react-ts
```

**Step 2: Install core dependencies**

```bash
npm install zustand framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer @types/node
npx tailwindcss init -p
```

**Step 3: Configure Tailwind với Pixel Art Theme**

Modify `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        casino: {
          gold: '#FFD700',
          purple: '#6B21A8',
          dark: '#0F0A1A',
          neon: '#FF00FF',
          blue: '#1e3a5f',
        },
        pixel: {
          green: '#00ff00',
          red: '#ff0000',
        }
      },
      imageRendering: {
        pixelated: 'pixelated',
      }
    },
  },
  plugins: [],
}
```

**Step 4: Update index.css với Tailwind directives + Pixel Art Styles**

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  /* Pixel-perfect rendering */
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

body {
  background: #0F0A1A;
  color: #ffffff;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  line-height: 1.5;
}

/* Pixel art button effects */
.btn-pixel {
  box-shadow:
    0 4px 0 #00000030,
    0 5px 0 #00000050,
    0 6px 4px #00000030;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-pixel:active {
  transform: translateY(4px);
  box-shadow:
    0 0 0 #00000030,
    0 1px 0 #00000050,
    0 2px 4px #00000030;
}

/* Pixel borders */
.pixel-border {
  box-shadow:
    -2px 0 0 0 #000,
    2px 0 0 0 #000,
    0 -2px 0 0 #000,
    0 2px 0 0 #000;
}
```

**Step 5: Verify setup**

```bash
npm run dev
```
Expected: Vite dev server starts, shows "Vite + React" placeholder

**Step 6: Commit**

```bash
git add .
git commit -m "chore: initialize React + TypeScript + Vite project with Tailwind"
```

---

### Task 2: Set Up Project Structure

**Files:**
- Create: `src/components/game/`
- Create: `src/components/gambling/`
- Create: `src/components/ui/`
- Create: `src/components/layout/`
- Create: `src/hooks/`
- Create: `src/store/`
- Create: `src/types/`
- Create: `src/utils/`
- Create: `public/assets/`

**Step 1: Create directory structure**

```bash
mkdir -p src/components/game src/components/gambling/Poker src/components/gambling/Blackjack src/components/ui src/components/layout
mkdir -p src/hooks src/store src/types src/utils/gambling-logic src/utils/combat-logic src/utils/pixel-art
mkdir -p public/assets public/assets/cards public/assets/characters public/assets/enemies public/assets/tiles public/assets/effects
mkdir -p docs/art-reference
```

**Step 2: Create .gitkeep files**

```bash
touch src/components/game/.gitkeep
touch src/components/gambling/Poker/.gitkeep
touch src/components/gambling/Blackjack/.gitkeep
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: create project directory structure"
```

---

### Task 2.5: Create Pixel Art Assets Guide & Placeholders

**Files:**
- Create: `docs/art-reference/pixel-art-specs.md`
- Create: `public/assets/sprites/placeholder-character.png`
- Create: `src/components/ui/PixelCard.tsx`
- Create: `src/components/ui/PixelButton.tsx`

**Step 1: Write pixel art specifications**

Create `docs/art-reference/pixel-art-specs.md`:
```markdown
# Pixel Art Specifications

## Sprite Sizes

| Asset | Size | Frames | Notes |
|-------|------|--------|-------|
| Character (overworld) | 32x32 | 4 (idle, walk, deal, win) | 4-direction |
| Character (portrait) | 48x48 | 2 (idle, talk) | Front view |
| Enemy | 32x32 or 64x64 | 3 (idle, attack, defeated) | Front view |
| Card | 64x96 | 1 | 2x scale for details |
| Icon | 16x16 | 1 | UI elements |
| Tile | 16x16 or 32x32 | 1 | Floor, table surfaces |
| Effect | 8x8 or 16x16 | 3-5 frames | Coins, damage, sparks |

## Color Palette

```
#0F0A1A - Dark background
#6B21A8 - Casino purple
#FFD700 - Gold
#FF00FF - Neon pink
#1e3a5f - Dark blue
#ffffff - White
#a0a0a0 - Gray
#00ff00 - Success green
#ff0000 - Danger red
```

## Tools Recommendation

- **Aseprite** (paid) - Professional pixel art editor
- **Piskel** (free) - Web-based pixel art editor
- **GraphicsGale** (free) - Powerful pixel art tool

## References

- Lospec.com - Color palettes and tutorials
- Sprite Resources - OpenGameArt.org
```

**Step 2: Create placeholder SVG for character**

Create `public/assets/sprites/character-placeholder.svg`:
```svg
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#6B21A8"/>
  <rect x="8" y="4" width="16" height="16" fill="#FFD700"/>
  <rect x="4" y="20" width="10" height="8" fill="#FFD700"/>
  <rect x="18" y="20" width="10" height="8" fill="#FFD700"/>
  <rect x="14" y="8" width="4" height="4" fill="#0F0A1A"/>
  <rect x="18" y="8" width="4" height="4" fill="#0F0A1A"/>
  <rect x="12" y="14" width="8" height="2" fill="#FF00FF"/>
</svg>
```

**Step 3: Create PixelCard component**

Create `src/components/ui/PixelCard.tsx`:
```tsx
import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'purple' | 'danger';
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const bgColors = {
    default: 'bg-gray-800',
    gold: 'bg-casino-purple',
    purple: 'bg-casino-purple',
    danger: 'bg-red-900',
  };

  return (
    <div
      className={`${bgColors[variant]} ${className} relative`}
      style={{
        boxShadow: `
          -4px 0 0 0 #000,
          4px 0 0 0 #000,
          0 -4px 0 0 #000,
          0 4px 0 0 #000
        `,
      }}
    >
      {children}
    </div>
  );
};
```

**Step 4: Create PixelButton component**

Create `src/components/ui/PixelButton.tsx`:
```tsx
import React from 'react';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const variants = {
    primary: 'bg-casino-gold text-casino-dark hover:bg-yellow-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} ${className}
        font-pixel px-6 py-3
        transition-all duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        active:translate-y-1
      `}
      style={{
        boxShadow: disabled
          ? 'none'
          : `
            0 4px 0 #00000030,
            0 5px 0 #00000050,
            0 6px 4px #00000030
          `,
        transform: 'translateY(0)',
      }}
    >
      {children}
    </button>
  );
};
```

**Step 5: Commit**

```bash
git add docs/art-reference/ public/assets/ src/components/ui/
git commit -m "feat: add pixel art specifications and placeholder components"
```

---

### Task 3: Define TypeScript Types

**Files:**
- Create: `src/types/game.ts`
- Create: `src/types/cards.ts`
- Create: `src/types/characters.ts`

**Step 1: Write game types**

Create `src/types/game.ts`:
```typescript
export interface GameState {
  currentFloor: number;
  maxFloor: number;
  currentRoom: Room | null;
  playerHP: number;
  maxHP: number;
  gold: number;
  isCombat: boolean;
  isGameOver: boolean;
  isVictory: boolean;
}

export interface Room {
  id: string;
  type: RoomType;
  enemy?: Enemy;
  reward?: Reward;
}

export type RoomType = 'gambling' | 'shop' | 'rest' | 'treasure' | 'elite' | 'boss';

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  class: string;
}

export interface Reward {
  type: 'gold' | 'card' | 'relic';
  amount?: number;
  card?: Card;
  relic?: Relic;
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  effect: string;
}
```

**Step 2: Write card types**

Create `src/types/cards.ts`:
```typescript
export type CardType = 'technique' | 'ability' | 'modifier';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  description: string;
  effect: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  level: number;
  maxLevel: number;
}

export interface Deck {
  cards: Card[];
  maxSize: number;
  minSize: number;
}

export interface Hand {
  cards: Card[];
  maxHandSize: number;
}

// Card database for MVP
export const CARD_DATABASE: Record<string, Omit<Card, 'id' | 'level'>> = {
  // Technique Cards
  'bluff': {
    name: 'Bluff',
    type: 'technique',
    description: 'Win a small round automatically',
    effect: 'auto-win-small',
    rarity: 'common',
    maxLevel: 3,
  },
  'double-down': {
    name: 'Double Down',
    type: 'technique',
    description: 'Double your bet, win 2x',
    effect: 'double-reward',
    rarity: 'uncommon',
    maxLevel: 3,
  },
  'peek': {
    name: 'Peek',
    type: 'technique',
    description: 'See 1 opponent card',
    effect: 'see-opponent-card',
    rarity: 'uncommon',
    maxLevel: 3,
  },
  // Ability Cards
  'fireball': {
    name: 'Fireball',
    type: 'ability',
    description: 'Deal damage when losing gambling',
    effect: 'damage-on-loss',
    rarity: 'common',
    maxLevel: 3,
  },
  'heal': {
    name: 'Heal',
    type: 'ability',
    description: 'Recover HP after losing',
    effect: 'heal-on-loss',
    rarity: 'common',
    maxLevel: 3,
  },
  // Modifier Cards
  'lucky-charm': {
    name: 'Lucky Charm',
    type: 'modifier',
    description: '+5% win rate',
    effect: 'win-rate-boost',
    rarity: 'uncommon',
    maxLevel: 3,
  },
  'hot-streak': {
    name: 'Hot Streak',
    type: 'modifier',
    description: 'Consecutive wins = bonus gold',
    effect: 'win-streak-bonus',
    rarity: 'rare',
    maxLevel: 3,
  },
};
```

**Step 3: Write character types**

Create `src/types/characters.ts`:
```typescript
export type CharacterClass = 'gambler' | 'cheat-master' | 'high-roller' | 'lucky-fool' | 'card-counter';

export interface Character {
  id: CharacterClass;
  name: string;
  description: string;
  maxHP: number;
  startingGold: number;
  startingDeck: string[]; // Card IDs
  specialAbility: string;
  unlocked: boolean;
  unlockRequirement?: string;
}

export const CHARACTER_CLASSES: Record<CharacterClass, Character> = {
  'gambler': {
    id: 'gambler',
    name: 'Gambler',
    description: 'A balanced adventurer, skilled in all games',
    maxHP: 100,
    startingGold: 50,
    startingDeck: ['bluff', 'peek', 'fireball', 'lucky-charm', 'heal'],
    specialAbility: '+10% gold found',
    unlocked: true,
  },
  'cheat-master': {
    id: 'cheat-master',
    name: 'Cheat Master',
    description: 'Master of deception, excels at card games',
    maxHP: 90,
    startingGold: 40,
    startingDeck: ['bluff', 'bluff', 'peek', 'peek', 'double-down'],
    specialAbility: 'Free Peek once per combat',
    unlocked: false,
    unlockRequirement: 'Win 5 runs with Gambler',
  },
  'high-roller': {
    id: 'high-roller',
    name: 'High Roller',
    description: 'High risk, high reward player',
    maxHP: 80,
    startingGold: 100,
    startingDeck: ['double-down', 'hot-streak', 'lucky-charm', 'fireball'],
    specialAbility: 'Start with +50% gold, -20% HP',
    unlocked: false,
    unlockRequirement: 'Accumulate 1000 Casino Coins',
  },
  'lucky-fool': {
    id: 'lucky-fool',
    name: 'Lucky Fool',
    description: 'Incredibly lucky but fragile',
    maxHP: 70,
    startingGold: 50,
    startingDeck: ['fireball', 'fireball', 'heal', 'lucky-charm', 'lucky-charm'],
    specialAbility: '+25% crit chance, -30% max HP',
    unlocked: false,
    unlockRequirement: 'Win a run without losing any combat',
  },
  'card-counter': {
    id: 'card-counter',
    name: 'Card Counter',
    description: 'Calculating master of probability',
    maxHP: 95,
    startingGold: 45,
    startingDeck: ['peek', 'peek', 'bluff', 'lucky-charm', 'hot-streak'],
    specialAbility: 'See history of last 5 rounds',
    unlocked: false,
    unlockRequirement: 'Beat boss with all 4 other classes',
  },
};
```

**Step 4: Commit**

```bash
git add src/types/
git commit -m "feat: define TypeScript types for game state, cards, and characters"
```

---

### Task 4: Create Zustand Stores

**Files:**
- Create: `src/store/gameStore.ts`
- Create: `src/store/metaStore.ts`
- Create: `src/store/deckStore.ts`

**Step 1: Write game store**

Create `src/store/gameStore.ts`:
```typescript
import { create } from 'zustand';
import { GameState, Room, Enemy } from '../types/game';
import { Card } from '../types/cards';

interface GameActions {
  // Initialization
  startNewRun: (characterClass: string) => void;
  loadGame: (savedState: any) => void;

  // Floor navigation
  nextFloor: () => void;
  enterRoom: (room: Room) => void;
  leaveRoom: () => void;

  // Combat
  startCombat: (enemy: Enemy) => void;
  endCombat: (victory: boolean) => void;

  // Player state
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => void;

  // Card management
  addCardToDeck: (card: Card) => void;
  removeCardFromDeck: (cardId: string) => void;

  // Game state
  setGameOver: (victory: boolean) => void;
  resetGame: () => void;
}

const initialGameState: GameState = {
  currentFloor: 1,
  maxFloor: 10,
  currentRoom: null,
  playerHP: 100,
  maxHP: 100,
  gold: 50,
  isCombat: false,
  isGameOver: false,
  isVictory: false,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialGameState,

  startNewRun: (characterClass) => {
    // Character stats will be applied from metaStore
    set({
      ...initialGameState,
      currentFloor: 1,
      playerHP: 100,
      maxHP: 100,
      gold: 50,
    });
  },

  loadGame: (savedState) => {
    set(savedState);
  },

  nextFloor: () => {
    set((state) => ({ currentFloor: state.currentFloor + 1 }));
  },

  enterRoom: (room) => {
    set({ currentRoom: room });
  },

  leaveRoom: () => {
    set({ currentRoom: null });
  },

  startCombat: (enemy) => {
    set({ isCombat: true });
  },

  endCombat: (victory) => {
    set({ isCombat: false });
  },

  takeDamage: (amount) => {
    set((state) => {
      const newHP = Math.max(0, state.playerHP - amount);
      if (newHP === 0) {
        return { playerHP: 0, isGameOver: true, isVictory: false };
      }
      return { playerHP: newHP };
    });
  },

  heal: (amount) => {
    set((state) => ({
      playerHP: Math.min(state.maxHP, state.playerHP + amount),
    }));
  },

  addGold: (amount) => {
    set((state) => ({ gold: state.gold + amount }));
  },

  spendGold: (amount) => {
    set((state) => ({ gold: state.gold - amount }));
  },

  addCardToDeck: (card) => {
    // Will be handled by deckStore
  },

  removeCardFromDeck: (cardId) => {
    // Will be handled by deckStore
  },

  setGameOver: (victory) => {
    set({ isGameOver: true, isVictory: victory });
  },

  resetGame: () => {
    set(initialGameState);
  },
}));
```

**Step 2: Write meta store**

Create `src/store/metaStore.ts`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterClass } from '../types/characters';
import { Card } from '../types/cards';

interface MetaState {
  casinoCoins: number;
  unlockedCharacters: CharacterClass[];
  unlockedCards: string[];
  unlockedGames: string[];
  permanentUpgrades: Record<string, number>;
  cosmetics: string[];
  achievements: string[];
  statistics: {
    runsPlayed: number;
    runsWon: number;
    totalGoldEarned: number;
    totalEnemiesDefeated: number;
    highestFloorReached: number;
  };
}

interface MetaActions {
  addCasinoCoins: (amount: number) => void;
  unlockCharacter: (character: CharacterClass) => void;
  unlockCard: (cardId: string) => void;
  unlockGame: (gameId: string) => void;
  purchaseUpgrade: (upgradeId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStatistics: (stats: Partial<MetaState['statistics']>) => void;
  resetMeta: () => void;
}

const initialMetaState: MetaState = {
  casinoCoins: 0,
  unlockedCharacters: ['gambler'],
  unlockedCards: ['bluff', 'peek', 'fireball', 'heal', 'lucky-charm'],
  unlockedGames: ['poker', 'blackjack'],
  permanentUpgrades: {},
  cosmetics: [],
  achievements: [],
  statistics: {
    runsPlayed: 0,
    runsWon: 0,
    totalGoldEarned: 0,
    totalEnemiesDefeated: 0,
    highestFloorReached: 0,
  },
};

export const useMetaStore = create<MetaState & MetaActions>()(
  persist(
    (set, get) => ({
      ...initialMetaState,

      addCasinoCoins: (amount) => {
        set((state) => ({ casinoCoins: state.casinoCoins + amount }));
      },

      unlockCharacter: (character) => {
        set((state) => {
          if (state.unlockedCharacters.includes(character)) return state;
          return { unlockedCharacters: [...state.unlockedCharacters, character] };
        });
      },

      unlockCard: (cardId) => {
        set((state) => {
          if (state.unlockedCards.includes(cardId)) return state;
          return { unlockedCards: [...state.unlockedCards, cardId] };
        });
      },

      unlockGame: (gameId) => {
        set((state) => {
          if (state.unlockedGames.includes(gameId)) return state;
          return { unlockedGames: [...state.unlockedGames, gameId] };
        });
      },

      purchaseUpgrade: (upgradeId) => {
        set((state) => ({
          permanentUpgrades: {
            ...state.permanentUpgrades,
            [upgradeId]: (state.permanentUpgrades[upgradeId] || 0) + 1,
          },
        }));
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          if (state.achievements.includes(achievementId)) return state;
          return { achievements: [...state.achievements, achievementId] };
        });
      },

      updateStatistics: (stats) => {
        set((state) => ({
          statistics: { ...state.statistics, ...stats },
        }));
      },

      resetMeta: () => {
        set(initialMetaState);
      },
    }),
    {
      name: 'meta-storage',
    }
  )
);
```

**Step 3: Write deck store**

Create `src/store/deckStore.ts`:
```typescript
import { create } from 'zustand';
import { Card, Deck } from '../types/cards';

interface DeckActions {
  initializeDeck: (startingCards: string[]) => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  drawHand: (handSize: number) => void;
  playCard: (cardId: string) => void;
  discardCard: (cardId: string) => void;
  shuffleDeck: () => void;
  resetDeck: () => void;
  upgradeCard: (cardId: string) => void;
}

const initialDeckState: Deck = {
  cards: [],
  maxSize: 20,
  minSize: 10,
};

export const useDeckStore = create<Deck & DeckActions>((set, get) => ({
  ...initialDeckState,

  initializeDeck: (startingCards) => {
    // Create initial deck from card IDs
    const cards = startingCards.map((cardId, index) => ({
      id: `${cardId}-${index}-${Date.now()}`,
      ...cardId, // Will be populated from CARD_DATABASE
      level: 1,
    }));
    set({ cards });
  },

  addCard: (card) => {
    set((state) => {
      if (state.cards.length >= state.maxSize) return state;
      return { cards: [...state.cards, card] };
    });
  },

  removeCard: (cardId) => {
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== cardId),
    }));
  },

  drawHand: (handSize) => {
    // Will be handled in game logic
  },

  playCard: (cardId) => {
    // Will be handled in game logic
  },

  discardCard: (cardId) => {
    // Will be handled in game logic
  },

  shuffleDeck: () => {
    set((state) => {
      const shuffled = [...state.cards].sort(() => Math.random() - 0.5);
      return { cards: shuffled };
    });
  },

  resetDeck: () => {
    set(initialDeckState);
  },

  upgradeCard: (cardId) => {
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, level: Math.min(c.level + 1, c.maxLevel) } : c
      ),
    }));
  },
}));
```

**Step 4: Commit**

```bash
git add src/store/
git commit -m "feat: create Zustand stores for game state, meta progression, and deck management"
```

---

## Phase 2: Core Game Components

### Task 5: Create Main Game Layout

**Files:**
- Create: `src/components/layout/GameLayout.tsx`
- Create: `src/components/layout/HUD.tsx`
- Create: `src/components/layout/MainMenu.tsx`

**Step 1: Write failing test**

Create `src/components/layout/GameLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { GameLayout } from './GameLayout';
import { useGameStore } from '../../store/gameStore';

describe('GameLayout', () => {
  it('renders HUD with player stats', () => {
    render(<GameLayout />);
    expect(screen.getByText(/HP:/i)).toBeInTheDocument();
    expect(screen.getByText(/Gold:/i)).toBeInTheDocument();
    expect(screen.getByText(/Floor:/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom
npx vitest run src/components/layout/GameLayout.test.tsx
```
Expected: FAIL - Module not found

**Step 3: Write GameLayout component**

Create `src/components/layout/GameLayout.tsx`:
```tsx
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { HUD } from './HUD';
import { MainMenu } from './MainMenu';

interface GameLayoutProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const { isGameOver, isVictory } = useGameStore();

  return (
    <div className="min-h-screen bg-casino-dark text-white">
      <HUD />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {(isGameOver || isVictory) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-casino-purple p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isVictory ? '🎉 Victory!' : '💀 Game Over'}
            </h2>
            <MainMenu />
          </div>
        </div>
      )}
    </div>
  );
};
```

**Step 4: Write HUD component**

Create `src/components/layout/HUD.tsx`:
```tsx
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Heart, Coins, Trophy, Layers } from 'lucide-react';

export const HUD: React.FC = () => {
  const { playerHP, maxHP, gold, currentFloor, maxFloor } = useGameStore();

  const hpPercentage = (playerHP / maxHP) * 100;

  return (
    <header className="bg-casino-purple/20 border-b border-casino-purple/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* HP Bar */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <Heart className="w-5 h-5 text-red-500" />
            <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-300"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium">{playerHP}/{maxHP}</span>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">{gold}</span>
          </div>

          {/* Floor */}
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-casino-gold" />
            <span className="font-medium">Floor {currentFloor}/{maxFloor}</span>
          </div>

          {/* Deck Size */}
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Deck: 15</span>
          </div>
        </div>
      </div>
    </header>
  );
};
```

**Step 5: Write MainMenu component**

Create `src/components/layout/MainMenu.tsx`:
```tsx
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Play, Save, ShoppingBag, BarChart3, Settings } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { startNewRun } = useGameStore();

  return (
    <div className="flex flex-col gap-4 min-w-[250px]">
      <button
        onClick={() => startNewRun('gambler')}
        className="flex items-center gap-3 p-4 bg-casino-gold text-casino-dark rounded-lg hover:bg-yellow-400 transition-colors font-bold"
      >
        <Play className="w-6 h-6" />
        New Run
      </button>

      <button className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
        <Save className="w-6 h-6" />
        Continue
      </button>

      <button className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
        <ShoppingBag className="w-6 h-6" />
        Meta Shop
      </button>

      <button className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
        <BarChart3 className="w-6 h-6" />
        Statistics
      </button>

      <button className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
        <Settings className="w-6 h-6" />
        Settings
      </button>
    </div>
  );
};
```

**Step 6: Run test to verify it passes**

```bash
npx vitest run src/components/layout/GameLayout.test.tsx
```
Expected: PASS

**Step 7: Commit**

```bash
git add src/components/layout/
git commit -m "feat: create GameLayout, HUD, and MainMenu components"
```

---

## Phase 3: Gambling Mini-Games

### Task 6: Create Poker Mini-Game

**Files:**
- Create: `src/components/gambling/Poker/PokerGame.tsx`
- Create: `src/components/gambling/Poker/PokerCard.tsx`
- Create: `src/utils/gambling-logic/poker.ts`

**Step 1: Write poker logic utility**

Create `src/utils/gambling-logic/poker.ts`:
```typescript
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
  // Simplified evaluation for MVP
  // In production, implement full poker hand evaluation
  const sorted = [...cards].sort((a, b) => b.value - a.value);

  return {
    cards: sorted,
    score: sorted.reduce((sum, card) => sum + card.value, 0),
    handType: 'High Card', // Simplified
  };
}

export function determineWinner(playerHand: PokerHand, enemyHand: PokerHand): 'player' | 'enemy' | 'tie' {
  if (playerHand.score > enemyHand.score) return 'player';
  if (enemyHand.score > playerHand.score) return 'enemy';
  return 'tie';
}
```

**Step 2: Write PokerGame component**

Create `src/components/gambling/Poker/PokerGame.tsx`:
```tsx
import React, { useState } from 'react';
import { PokerCard, createDeck, shuffleDeck, drawCards, evaluateHand, determineWinner } from '../../../utils/gambling-logic/poker';
import { PokerCard as PokerCardComponent } from './PokerCard';

interface PokerGameProps {
  onResult: (result: 'win' | 'lose' | 'tie') => void;
  onExit: () => void;
}

export const PokerGame: React.FC<PokerGameProps> = ({ onResult, onExit }) => {
  const [playerHand, setPlayerHand] = useState<PokerCard[]>([]);
  const [enemyHand, setEnemyHand] = useState<PokerCard[]>([]);
  const [phase, setPhase] = useState<'betting' | 'playing' | 'result'>('betting');
  const [result, setResult] = useState<'win' | 'lose' | 'tie' | null>(null);

  const dealCards = () => {
    const deck = shuffleDeck(createDeck());
    const { drawn: player, remaining } = drawCards(deck, 5);
    const { drawn: enemy } = drawCards(remaining, 5);

    setPlayerHand(player);
    setEnemyHand(enemy);
    setPhase('playing');
  };

  const playHand = () => {
    const playerEval = evaluateHand(playerHand);
    const enemyEval = evaluateHand(enemyHand);
    const winner = determineWinner(playerEval, enemyEval);

    setResult(winner === 'player' ? 'win' : winner === 'enemy' ? 'lose' : 'tie');
    setPhase('result');
    onResult(winner === 'player' ? 'win' : winner === 'enemy' ? 'lose' : 'tie');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">🃏 Poker Duel</h2>
        <p className="text-gray-400">Highest hand value wins!</p>
      </div>

      {/* Enemy Area */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h3 className="text-lg font-semibold mb-3">Enemy Hand</h3>
        <div className="flex gap-2 justify-center">
          {enemyHand.map((card, index) => (
            <PokerCardComponent
              key={index}
              card={card}
              hidden={phase === 'betting' || phase === 'playing'}
            />
          ))}
        </div>
      </div>

      {/* Player Area */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h3 className="text-lg font-semibold mb-3">Your Hand</h3>
        <div className="flex gap-2 justify-center flex-wrap">
          {playerHand.map((card, index) => (
            <PokerCardComponent key={index} card={card} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        {phase === 'betting' && (
          <button
            onClick={dealCards}
            className="px-6 py-3 bg-casino-gold text-casino-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Deal Cards
          </button>
        )}

        {phase === 'playing' && (
          <button
            onClick={playHand}
            className="px-6 py-3 bg-green-600 font-bold rounded-lg hover:bg-green-500 transition-colors"
          >
            Play Hand
          </button>
        )}

        <button
          onClick={onExit}
          className="px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
        >
          {phase === 'result' ? 'Close' : 'Fold'}
        </button>
      </div>

      {/* Result Display */}
      {phase === 'result' && result && (
        <div className="mt-6 text-center">
          <div className={`text-2xl font-bold ${
            result === 'win' ? 'text-green-500' : result === 'lose' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            {result === 'win' ? '🎉 You Win!' : result === 'lose' ? '💀 You Lose' : '🤝 Tie'}
          </div>
        </div>
      )}
    </div>
  );
};
```

**Step 3: Write PokerCard component**

Create `src/components/gambling/Poker/PokerCard.tsx`:
```tsx
import React from 'react';
import { PokerCard as CardType } from '../../../utils/gambling-logic/poker';

interface PokerCardProps {
  card: CardType;
  hidden?: boolean;
}

export const PokerCard: React.FC<PokerCardProps> = ({ card, hidden }) => {
  if (hidden) {
    return (
      <div className="w-16 h-24 bg-casino-purple rounded-lg border-2 border-casino-gold flex items-center justify-center">
        <div className="w-12 h-20 bg-casino-purple/50 rounded" />
      </div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center text-casino-dark">
      <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.rank}
      </span>
      <span className={`text-2xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.suit === 'hearts' && '♥'}
        {card.suit === 'diamonds' && '♦'}
        {card.suit === 'clubs' && '♣'}
        {card.suit === 'spades' && '♠'}
      </span>
    </div>
  );
};
```

**Step 4: Commit**

```bash
git add src/utils/gambling-logic/poker.ts src/components/gambling/Poker/
git commit -m "feat: create Poker mini-game with card logic and components"
```

---

### Task 7: Create Blackjack Mini-Game

**Files:**
- Create: `src/components/gambling/Blackjack/BlackjackGame.tsx`
- Create: `src/components/gambling/Blackjack/BlackjackCard.tsx`
- Create: `src/utils/gambling-logic/blackjack.ts`

**Step 1: Write blackjack logic utility**

Create `src/utils/gambling-logic/blackjack.ts`:
```typescript
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
        value = 11; // Will be adjusted in hand calculation
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

  // Adjust for aces if bust
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
```

**Step 2: Write BlackjackGame component**

Create `src/components/gambling/Blackjack/BlackjackGame.tsx`:
```tsx
import React, { useState } from 'react';
import {
  BlackjackCard,
  createDeck,
  shuffleDeck,
  calculateHand,
  isBust,
  isBlackjack,
  determineWinner,
} from '../../../utils/gambling-logic/blackjack';
import { BlackjackCard as CardComponent } from './BlackjackCard';

interface BlackjackGameProps {
  onResult: (result: 'win' | 'lose' | 'tie', multiplier?: number) => void;
  onExit: () => void;
}

export const BlackjackGame: React.FC<BlackjackGameProps> = ({ onResult, onExit }) => {
  const [deck, setDeck] = useState<BlackjackCard[]>([]);
  const [playerHand, setPlayerHand] = useState<BlackjackCard[]>([]);
  const [dealerHand, setDealerHand] = useState<BlackjackCard[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | 'tie' | null>(null);

  const dealInitialCards = () => {
    const newDeck = shuffleDeck(createDeck());
    const player = [newDeck[0], newDeck[2]];
    const dealer = [newDeck[1], newDeck[3]];

    setPlayerHand(player);
    setDealerHand(dealer);
    setDeck(newDeck.slice(4));
    setGameOver(false);
    setResult(null);

    // Check for instant blackjack
    if (isBlackjack(player)) {
      setGameOver(true);
      setResult('win');
      onResult('win', 1.5);
    }
  };

  const hit = () => {
    if (deck.length === 0 || gameOver) return;

    const newCard = deck[0];
    const newHand = [...playerHand, newCard];

    setPlayerHand(newHand);
    setDeck(deck.slice(1));

    if (isBust(newHand)) {
      setGameOver(true);
      setResult('lose');
      onResult('lose');
    }
  };

  const stand = () => {
    if (gameOver) return;

    // Dealer draws until 17 or higher
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];

    while (calculateHand(newDealerHand) < 17 && newDeck.length > 0) {
      newDealerHand.push(newDeck[0]);
      newDeck = newDeck.slice(1);
    }

    setDealerHand(newDealerHand);
    setDeck(newDeck);
    setGameOver(true);

    const winner = determineWinner(playerHand, newDealerHand);
    setResult(winner);
    onResult(winner);
  };

  const playerTotal = calculateHand(playerHand);
  const dealerTotal = gameOver ? calculateHand(dealerHand) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">🎰 Blackjack</h2>
        <p className="text-gray-400">Beat the dealer without going over 21!</p>
      </div>

      {/* Dealer Area */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h3 className="text-lg font-semibold mb-3">
          Dealer {gameOver && `(${dealerTotal})`}
        </h3>
        <div className="flex gap-2 justify-center flex-wrap">
          {dealerHand.map((card, index) => (
            <CardComponent key={index} card={card} />
          ))}
        </div>
      </div>

      {/* Player Area */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h3 className="text-lg font-semibold mb-3">
          You ({playerTotal})
        </h3>
        <div className="flex gap-2 justify-center flex-wrap">
          {playerHand.map((card, index) => (
            <CardComponent key={index} card={card} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        {playerHand.length === 0 ? (
          <button
            onClick={dealInitialCards}
            className="px-6 py-3 bg-casino-gold text-casino-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Deal
          </button>
        ) : !gameOver ? (
          <>
            <button
              onClick={hit}
              className="px-6 py-3 bg-green-600 font-bold rounded-lg hover:bg-green-500 transition-colors"
            >
              Hit
            </button>
            <button
              onClick={stand}
              className="px-6 py-3 bg-red-600 font-bold rounded-lg hover:bg-red-500 transition-colors"
            >
              Stand
            </button>
          </>
        ) : (
          <>
            <button
              onClick={dealInitialCards}
              className="px-6 py-3 bg-casino-gold text-casino-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              New Game
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Exit
            </button>
          </>
        )}
      </div>

      {/* Result Display */}
      {gameOver && result && (
        <div className="mt-6 text-center">
          <div className={`text-2xl font-bold ${
            result === 'win' ? 'text-green-500' : result === 'lose' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            {result === 'win' ? '🎉 You Win!' : result === 'lose' ? '💀 You Lose' : '🤝 Push'}
          </div>
        </div>
      )}
    </div>
  );
};
```

**Step 3: Write BlackjackCard component**

Create `src/components/gambling/Blackjack/BlackjackCard.tsx`:
```tsx
import React from 'react';
import { BlackjackCard as CardType } from '../../../utils/gambling-logic/blackjack';

interface BlackjackCardProps {
  card: CardType;
}

export const BlackjackCard: React.FC<BlackjackCardProps> = ({ card }) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center text-casino-dark">
      <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.rank}
      </span>
      <span className={`text-2xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.suit === 'hearts' && '♥'}
        {card.suit === 'diamonds' && '♦'}
        {card.suit === 'clubs' && '♣'}
        {card.suit === 'spades' && '♠'}
      </span>
    </div>
  );
};
```

**Step 4: Commit**

```bash
git add src/utils/gambling-logic/blackjack.ts src/components/gambling/Blackjack/
git commit -m "feat: create Blackjack mini-game with dealer AI and components"
```

---

## Phase 4: Shop & Progression

### Task 8: Create Shop Component

**Files:**
- Create: `src/components/game/Shop.tsx`
- Create: `src/components/game/ShopItem.tsx`

**Step 1: Write Shop component**

Create `src/components/game/Shop.tsx`:
```tsx
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useDeckStore } from '../../store/deckStore';
import { Card } from '../../types/cards';
import { ShoppingBag, X } from 'lucide-react';

interface ShopProps {
  onExit: () => void;
}

export const Shop: React.FC<ShopProps> = ({ onExit }) => {
  const { gold, spendGold } = useGameStore();
  const { addCard, removeCard } = useDeckStore();

  const shopItems = [
    { id: 1, type: 'card', name: 'Random Card', cost: 75, description: 'Add a random card to your deck' },
    { id: 2, type: 'remove', name: 'Remove Card', cost: 50, description: 'Remove a card from your deck' },
    { id: 3, type: 'potion', name: 'Health Potion', cost: 40, description: 'Restore 30 HP' },
    { id: 4, type: 'upgrade', name: 'Card Upgrade', cost: 100, description: 'Upgrade a card (in-run)' },
  ];

  const buyItem = (item: typeof shopItems[0]) => {
    if (gold >= item.cost) {
      spendGold(item.cost);

      if (item.type === 'card') {
        // Add random card logic here
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-casino-purple/20 rounded-lg p-8 border border-casino-purple/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-casino-gold" />
            <h2 className="text-2xl font-bold">Casino Shop</h2>
          </div>
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 text-xl">
          💰 Gold: <span className="text-casino-gold font-bold">{gold}</span>
        </div>

        <div className="grid gap-4">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 bg-gray-800 rounded-lg ${
                gold < item.cost ? 'opacity-50' : 'hover:bg-gray-700 cursor-pointer'
              } transition-colors`}
              onClick={() => buyItem(item)}
            >
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <div className="text-casino-gold font-bold">
                💰 {item.cost}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add src/components/game/Shop.tsx
git commit -m "feat: create in-run shop component for card purchases"
```

---

## Phase 5: Save/Load System

### Task 9: Implement Save/Load with localStorage

**Files:**
- Create: `src/utils/save-load/saveManager.ts`
- Create: `src/hooks/useSaveLoad.ts`

**Step 1: Write save manager utility**

Create `src/utils/save-load/saveManager.ts`:
```typescript
import { GameState } from '../../types/game';
import { MetaState } from '../../store/metaStore';

const SAVE_KEY = 'rogluck_game_save';
const META_KEY = 'rogluck_meta_save';

export interface SaveData {
  gameState: Partial<GameState>;
  deck: any[];
  timestamp: number;
  floor: number;
}

export const saveManager = {
  saveGame: (gameState: Partial<GameState>, deck: any[]) => {
    const saveData: SaveData = {
      gameState,
      deck,
      timestamp: Date.now(),
      floor: gameState.currentFloor || 1,
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  },

  loadGame: (): SaveData | null => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  },

  deleteSave: () => {
    localStorage.removeItem(SAVE_KEY);
  },

  hasSave: (): boolean => {
    return localStorage.getItem(SAVE_KEY) !== null;
  },

  // Meta state is auto-saved by Zustand persist middleware
  getMetaState: (): Partial<MetaState> | null => {
    try {
      const saved = localStorage.getItem(META_KEY);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to load meta state:', error);
      return null;
    }
  },
};
```

**Step 2: Write useSaveLoad hook**

Create `src/hooks/useSaveLoad.ts`:
```typescript
import { useCallback } from 'react';
import { saveManager } from '../utils/save-load/saveManager';
import { useGameStore } from '../store/gameStore';
import { useDeckStore } from '../store/deckStore';

export function useSaveLoad() {
  const gameState = useGameStore();
  const deck = useDeckStore();

  const saveGame = useCallback(() => {
    const saved = saveManager.saveGame(
      {
        currentFloor: gameState.currentFloor,
        playerHP: gameState.playerHP,
        maxHP: gameState.maxHP,
        gold: gameState.gold,
      },
      deck.cards
    );
    return saved;
  }, [gameState, deck]);

  const loadGame = useCallback(() => {
    const saved = saveManager.loadGame();
    if (saved) {
      gameState.loadGame(saved.gameState);
      // Initialize deck from saved data
      return true;
    }
    return false;
  }, [gameState]);

  const deleteSave = useCallback(() => {
    saveManager.deleteSave();
  }, []);

  const hasSave = useCallback(() => {
    return saveManager.hasSave();
  }, []);

  return { saveGame, loadGame, deleteSave, hasSave };
}
```

**Step 3: Commit**

```bash
git add src/utils/save-load/ src/hooks/useSaveLoad.ts
git commit -m "feat: implement save/load system with localStorage"
```

---

## Phase 6: Main Menu & Character Select

### Task 10: Create Character Select Screen

**Files:**
- Create: `src/components/layout/CharacterSelect.tsx`
- Modify: `src/App.tsx`

**Step 1: Write CharacterSelect component**

Create `src/components/layout/CharacterSelect.tsx`:
```tsx
import React from 'react';
import { CHARACTER_CLASSES, CharacterClass } from '../../types/characters';
import { useMetaStore } from '../../store/metaStore';
import { useGameStore } from '../../store/gameStore';
import { Lock } from 'lucide-react';

interface CharacterSelectProps {
  onCharacterSelected: (character: CharacterClass) => void;
  onBack: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onCharacterSelected, onBack }) => {
  const { unlockedCharacters } = useMetaStore();
  const { startNewRun } = useGameStore();

  const handleSelect = (characterId: CharacterClass) => {
    if (unlockedCharacters.includes(characterId)) {
      startNewRun(characterId);
      onCharacterSelected(characterId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Select Your Character</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(CHARACTER_CLASSES).map((character) => {
          const isUnlocked = unlockedCharacters.includes(character.id);

          return (
            <div
              key={character.id}
              className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${
                isUnlocked
                  ? 'bg-casino-purple/20 border-casino-purple hover:border-casino-gold'
                  : 'bg-gray-800 border-gray-700 opacity-50'
              }`}
              onClick={() => handleSelect(character.id)}
            >
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{character.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{character.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>❤️ HP:</span>
                  <span className="font-medium">{character.maxHP}</span>
                </div>
                <div className="flex justify-between">
                  <span>💰 Gold:</span>
                  <span className="font-medium">{character.startingGold}</span>
                </div>
                <div className="flex justify-between">
                  <span>🃏 Cards:</span>
                  <span className="font-medium">{character.startingDeck.length}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-casino-gold">{character.specialAbility}</p>
              </div>

              {!isUnlocked && (
                <div className="mt-4 text-xs text-gray-500">
                  🔒 {character.unlockRequirement}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="mt-8 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Back to Menu
      </button>
    </div>
  );
};
```

**Step 2: Update App.tsx with game routing**

Modify `src/App.tsx`:
```tsx
import React, { useState } from 'react';
import { GameLayout } from './components/layout/GameLayout';
import { MainMenu } from './components/layout/MainMenu';
import { CharacterSelect } from './components/layout/CharacterSelect';
import { PokerGame } from './components/gambling/Poker/PokerGame';
import { BlackjackGame } from './components/gambling/Blackjack/BlackjackGame';
import { Shop } from './components/game/Shop';

type Screen = 'menu' | 'character-select' | 'game' | 'poker' | 'blackjack' | 'shop';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MainMenu />;
      case 'character-select':
        return (
          <CharacterSelect
            onCharacterSelected={() => setCurrentScreen('game')}
            onBack={() => setCurrentScreen('menu')}
          />
        );
      case 'poker':
        return (
          <PokerGame
            onResult={() => {}}
            onExit={() => setCurrentScreen('game')}
          />
        );
      case 'blackjack':
        return (
          <BlackjackGame
            onResult={() => {}}
            onExit={() => setCurrentScreen('game')}
          />
        );
      case 'shop':
        return <Shop onExit={() => setCurrentScreen('game')} />;
      default:
        return (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">🎰 Dungeon Casino Rogue</h1>
            <p className="text-gray-400 mb-8">Select a game to play or explore the dungeon</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentScreen('poker')}
                className="px-6 py-3 bg-casino-purple rounded-lg hover:bg-purple-600 transition-colors"
              >
                🃏 Play Poker
              </button>
              <button
                onClick={() => setCurrentScreen('blackjack')}
                className="px-6 py-3 bg-casino-purple rounded-lg hover:bg-purple-600 transition-colors"
              >
                🎰 Play Blackjack
              </button>
              <button
                onClick={() => setCurrentScreen('shop')}
                className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                🏪 Visit Shop
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <GameLayout>
      {renderScreen()}
    </GameLayout>
  );
}

export default App;
```

**Step 3: Commit**

```bash
git add src/components/layout/CharacterSelect.tsx src/App.tsx
git commit -m "feat: create character select screen and main app routing"
```

---

## Phase 7: Testing & Polish

### Task 11: Write Integration Tests

**Files:**
- Create: `src/tests/integration/game-flow.test.tsx`

**Step 1: Write game flow test**

Create `src/tests/integration/game-flow.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App';

describe('Game Flow Integration', () => {
  it('navigates from menu to character select to game', () => {
    render(<App />);

    // Should show main menu
    expect(screen.getByText(/New Run/i)).toBeInTheDocument();

    // Click New Run -> go to character select
    fireEvent.click(screen.getByText(/New Run/i));
    expect(screen.getByText(/Select Your Character/i)).toBeInTheDocument();

    // Select Gambler -> go to game
    fireEvent.click(screen.getByText(/Gambler/i));
    expect(screen.getByText(/Dungeon Casino Rogue/i)).toBeInTheDocument();
  });

  it('can navigate to poker game and back', () => {
    render(<App />);

    // Navigate to game screen
    fireEvent.click(screen.getByText(/New Run/i));
    fireEvent.click(screen.getByText(/Gambler/i));

    // Click Play Poker
    fireEvent.click(screen.getByText(/Play Poker/i));
    expect(screen.getByText(/Poker Duel/i)).toBeInTheDocument();

    // Exit back to game
    fireEvent.click(screen.getByText(/Exit/i));
    expect(screen.getByText(/Dungeon Casino Rogue/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run tests**

```bash
npx vitest run src/tests/integration/game-flow.test.tsx
```

**Step 3: Commit**

```bash
git add src/tests/integration/
git commit -m "test: add integration tests for game flow"
```

---

## Phase 8: Documentation

### Task 12: Write README.md

**Files:**
- Create: `README.md`

**Step 1: Write README**

Create `README.md`:
```markdown
# 🎰 Dungeon Casino Rogue

A roguelike deck-building web game with gambling mini-games. No real money involved - purely for entertainment!

## 🎮 Features

- **5 Character Classes**: Gambler, Cheat Master, High Roller, Lucky Fool, Card Counter
- **Gambling Mini-Games**: Poker, Blackjack, and more
- **Deck-Building**: Collect and upgrade cards during runs
- **Roguelike Mechanics**: Procedural floors, permadeath, meta-progression
- **Shop System**: Buy cards, upgrades, and items between floors

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Storage**: localStorage / IndexedDB

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🎯 How to Play

1. **Select a Character**: Choose from 5 unique classes
2. **Enter the Dungeon**: Explore 10 floors of casino challenges
3. **Play Mini-Games**: Win at Poker, Blackjack, and other games
4. **Build Your Deck**: Collect cards and upgrade them
5. **Beat the Boss**: Defeat the House Casino Owner on Floor 10

## 📋 MVP Scope

- [x] Project setup with React + TypeScript
- [x] Zustand state management
- [x] Poker mini-game
- [x] Blackjack mini-game
- [x] Shop system
- [x] Save/Load functionality
- [x] Character selection

## 📄 License

MIT

---

Built with ❤️ for gambling and roguelike fans everywhere!
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup instructions and game overview"
```

---

## ✅ MVP Complete Checklist

After completing all tasks above, the MVP should have:

- [x] React + TypeScript project with Tailwind CSS
- [x] Zustand stores for game state, meta progression, and deck
- [x] TypeScript types for cards, characters, and game state
- [x] Poker mini-game with card logic
- [x] Blackjack mini-game with dealer AI
- [x] Shop component for in-run purchases
- [x] Save/Load system with localStorage
- [x] Main menu with character selection
- [x] App routing between screens
- [x] Integration tests
- [x] README documentation

---

## 🔮 Next Steps (Post-MVP)

After MVP is complete, continue with:

1. **More Gambling Games**: Roulette, Slot Machine, Dice games
2. **Floor Generation**: Procedural dungeon layout system
3. **Combat Integration**: Connect gambling results to combat
4. **Card System**: Full deck-building with all 50+ cards
5. **Meta Shop**: Permanent upgrades and unlocks
6. **Achievements**: Track player progress
7. **Polish**: Animations, sound effects, mobile responsiveness

---

**Plan complete and saved to `docs/plans/2026-03-11-mvp-implementation-plan.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans skill, batch execution with checkpoints

**Which approach?**
