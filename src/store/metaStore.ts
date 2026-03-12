import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterClass, CHARACTER_CLASSES } from '../types/characters';

export { CHARACTER_CLASSES };

// Achievement Definitions
export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (stats: MetaState['statistics'], cardCollection?: CardCollection) => boolean;
  reward: number; // Casino Coins
  icon: string;
  category: 'progress' | 'combat' | 'gambling' | 'collection';
}

export const ACHIEVEMENTS: Achievement[] = [
  // Progress Achievements
  {
    id: 'first_run',
    name: 'First Steps',
    description: 'Complete your first run',
    condition: (stats) => stats.runsPlayed >= 1,
    reward: 50,
    icon: '🎯',
    category: 'progress',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Play 10 runs',
    condition: (stats) => stats.runsPlayed >= 10,
    reward: 200,
    icon: '🎖️',
    category: 'progress',
  },
  {
    id: 'first_win',
    name: 'Victory!',
    description: 'Win your first run',
    condition: (stats) => stats.runsWon >= 1,
    reward: 300,
    icon: '🏆',
    category: 'progress',
  },
  {
    id: 'win_streak',
    name: 'Unstoppable',
    description: 'Win 5 runs',
    condition: (stats) => stats.runsWon >= 5,
    reward: 400,
    icon: '🔥',
    category: 'progress',
  },

  // Combat Achievements
  {
    id: 'enemy_slayer',
    name: 'Enemy Slayer',
    description: 'Defeat 50 enemies',
    condition: (stats) => stats.totalEnemiesDefeated >= 50,
    reward: 150,
    icon: '⚔️',
    category: 'combat',
  },
  {
    id: 'floor_master',
    name: 'Floor Master',
    description: 'Reach floor 10',
    condition: (stats) => stats.highestFloorReached >= 10,
    reward: 500,
    icon: '👹',
    category: 'combat',
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Defeat 100 enemies',
    condition: (stats) => stats.totalEnemiesDefeated >= 100,
    reward: 300,
    icon: '🛡️',
    category: 'combat',
  },

  // Gambling Achievements
  {
    id: 'high_roller',
    name: 'High Roller',
    description: 'Earn 1000 gold total',
    condition: (stats) => stats.totalGoldEarned >= 1000,
    reward: 250,
    icon: '💰',
    category: 'gambling',
  },
  {
    id: 'lucky_seven',
    name: 'Lucky Seven',
    description: 'Win 7 gambling games in a row',
    condition: () => false, // Special achievement, tracked separately
    reward: 400,
    icon: '7️⃣',
    category: 'gambling',
  },
  {
    id: 'gambler',
    name: 'Born Gambler',
    description: 'Earn 5000 gold total',
    condition: (stats) => stats.totalGoldEarned >= 5000,
    reward: 500,
    icon: '🎲',
    category: 'gambling',
  },

  // Collection Achievements
  {
    id: 'card_collector',
    name: 'Card Collector',
    description: 'Unlock 20 cards',
    condition: (_stats, cardCollection) => (cardCollection?.unlocked.length || 0) >= 20,
    reward: 200,
    icon: '🃏',
    category: 'collection',
  },
  {
    id: 'master_collector',
    name: 'Master Collector',
    description: 'Unlock 40 cards',
    condition: (_stats, cardCollection) => (cardCollection?.unlocked.length || 0) >= 40,
    reward: 400,
    icon: '📚',
    category: 'collection',
  },
];

// Permanent Upgrade Definitions
export interface PermanentUpgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  maxLevel: number;
  effectPerLevel: number;
  effectType: 'hp' | 'gold' | 'luck' | 'discount' | 'deck_slots';
}

export const PERMANENT_UPGRADES: Record<string, PermanentUpgrade> = {
  'health_boost': {
    id: 'health_boost',
    name: 'Health Boost',
    description: '+10 max HP per level',
    baseCost: 100,
    maxLevel: 5,
    effectPerLevel: 10,
    effectType: 'hp',
  },
  'starting_gold': {
    id: 'starting_gold',
    name: 'Starting Gold',
    description: '+20 starting gold per level',
    baseCost: 150,
    maxLevel: 5,
    effectPerLevel: 20,
    effectType: 'gold',
  },
  'luck_stat': {
    id: 'luck_stat',
    name: 'Luck',
    description: '+2% win rate per level',
    baseCost: 200,
    maxLevel: 10,
    effectPerLevel: 2,
    effectType: 'luck',
  },
  'shop_discount': {
    id: 'shop_discount',
    name: 'Merchant\'s Friend',
    description: '-5% shop prices per level',
    baseCost: 250,
    maxLevel: 5,
    effectPerLevel: 5,
    effectType: 'discount',
  },
  'card_slots': {
    id: 'card_slots',
    name: 'Deck Capacity',
    description: '+1 max deck size per level',
    baseCost: 300,
    maxLevel: 3,
    effectPerLevel: 1,
    effectType: 'deck_slots',
  },
};

interface CardCollection {
  unlocked: string[]; // Card IDs
  maxLevel: Record<string, number>; // Highest level achieved per card
  timesUsed: Record<string, number>; // Times used in runs
  timesWon: Record<string, number>; // Times won with card
}

interface MetaState {
  casinoCoins: number;
  unlockedCharacters: CharacterClass[];
  unlockedCards: string[];
  cardCollection: CardCollection;
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
    winStreak: number;
    bestWinStreak: number;
  };
}

interface MetaActions {
  addCasinoCoins: (amount: number) => void;
  unlockCharacter: (character: CharacterClass) => void;
  unlockCard: (cardId: string) => void;
  updateCardStats: (cardId: string, won: boolean) => void;
  getCardStats: (cardId: string) => { maxLevel: number; timesUsed: number; timesWon: number };
  unlockGame: (gameId: string) => void;
  purchaseUpgrade: (upgradeId: string) => void;
  getUpgradeLevel: (upgradeId: string) => number;
  canAffordUpgrade: (upgradeId: string) => boolean;
  getUpgradeCost: (upgradeId: string) => number;
  getCharacterUnlockCost: (characterId: string) => number;
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => string[];
  getAchievementProgress: (achievementId: string) => { current: number; required: number };
  updateStatistics: (stats: Partial<MetaState['statistics']>) => void;
  resetMeta: () => void;
}

const initialMetaState: MetaState = {
  casinoCoins: 0,
  unlockedCharacters: ['gambler'],
  unlockedCards: ['bluff', 'peek', 'fireball', 'heal', 'lucky-charm'],
  cardCollection: {
    unlocked: ['bluff', 'peek', 'fireball', 'heal', 'lucky-charm'],
    maxLevel: {},
    timesUsed: {},
    timesWon: {},
  },
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
    winStreak: 0,
    bestWinStreak: 0,
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
        const cost = get().getCharacterUnlockCost(character);

        // Check if already unlocked
        if (get().unlockedCharacters.includes(character)) return;

        // Check if can afford
        if (get().casinoCoins < cost) return;

        // Deduct coins and unlock character
        set((state) => ({
          casinoCoins: state.casinoCoins - cost,
          unlockedCharacters: [...state.unlockedCharacters, character],
        }));
      },

      unlockCard: (cardId) => {
        set((state) => {
          if (state.unlockedCards.includes(cardId)) return state;
          return {
            unlockedCards: [...state.unlockedCards, cardId],
            cardCollection: {
              ...state.cardCollection,
              unlocked: [...state.cardCollection.unlocked, cardId],
            },
          };
        });
      },

      updateCardStats: (cardId, won) => {
        set((state) => ({
          cardCollection: {
            ...state.cardCollection,
            timesUsed: {
              ...state.cardCollection.timesUsed,
              [cardId]: (state.cardCollection.timesUsed[cardId] || 0) + 1,
            },
            timesWon: {
              ...state.cardCollection.timesWon,
              [cardId]: won
                ? (state.cardCollection.timesWon[cardId] || 0) + 1
                : state.cardCollection.timesWon[cardId] || 0,
            },
          },
        }));
      },

      getCardStats: (cardId) => {
        const state = get();
        return {
          maxLevel: state.cardCollection.maxLevel[cardId] || 0,
          timesUsed: state.cardCollection.timesUsed[cardId] || 0,
          timesWon: state.cardCollection.timesWon[cardId] || 0,
        };
      },

      unlockGame: (gameId) => {
        set((state) => {
          if (state.unlockedGames.includes(gameId)) return state;
          return { unlockedGames: [...state.unlockedGames, gameId] };
        });
      },

      purchaseUpgrade: (upgradeId) => {
        const upgrade = PERMANENT_UPGRADES[upgradeId];
        const currentLevel = get().permanentUpgrades[upgradeId] || 0;

        // Check if already maxed
        if (currentLevel >= upgrade.maxLevel) return;

        // Calculate cost
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, currentLevel));

        // Check if can afford
        if (get().casinoCoins < cost) return;

        // Deduct coins and add level
        set((state) => ({
          casinoCoins: state.casinoCoins - cost,
          permanentUpgrades: {
            ...state.permanentUpgrades,
            [upgradeId]: currentLevel + 1,
          },
        }));
      },

      getUpgradeLevel: (upgradeId) => {
        return get().permanentUpgrades[upgradeId] || 0;
      },

      canAffordUpgrade: (upgradeId) => {
        const upgrade = PERMANENT_UPGRADES[upgradeId];
        const currentLevel = get().permanentUpgrades[upgradeId] || 0;

        if (currentLevel >= upgrade.maxLevel) return false;

        const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, currentLevel));
        return get().casinoCoins >= cost;
      },

      getUpgradeCost: (upgradeId) => {
        const upgrade = PERMANENT_UPGRADES[upgradeId];
        const currentLevel = get().permanentUpgrades[upgradeId] || 0;
        return Math.floor(upgrade.baseCost * Math.pow(1.5, currentLevel));
      },

      getCharacterUnlockCost: (characterId) => {
        const { unlockedCharacters } = get();
        if (unlockedCharacters.includes(characterId as CharacterClass)) return 0;
        return 500; // Base cost for all characters
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          if (state.achievements.includes(achievementId)) return state;
          return { achievements: [...state.achievements, achievementId] };
        });
      },

      checkAchievements: () => {
        const state = get();
        const newlyUnlocked: string[] = [];

        ACHIEVEMENTS.forEach((achievement) => {
          if (!state.achievements.includes(achievement.id)) {
            const isUnlocked = achievement.condition(state.statistics, state.cardCollection);
            if (isUnlocked) {
              newlyUnlocked.push(achievement.id);
              state.achievements = [...state.achievements, achievement.id];
              state.casinoCoins += achievement.reward;
            }
          }
        });

        if (newlyUnlocked.length > 0) {
          set({
            achievements: state.achievements,
            casinoCoins: state.casinoCoins,
          });
        }

        return newlyUnlocked;
      },

      getAchievementProgress: (achievementId) => {
        const state = get();
        const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);

        if (!achievement) return { current: 0, required: 0 };

        // Calculate progress based on achievement type
        switch (achievement.id) {
          case 'first_run':
          case 'veteran':
            return { current: state.statistics.runsPlayed, required: achievement.id === 'veteran' ? 10 : 1 };
          case 'first_win':
          case 'win_streak':
            return { current: state.statistics.runsWon, required: achievement.id === 'win_streak' ? 5 : 1 };
          case 'enemy_slayer':
          case 'warrior':
            return { current: state.statistics.totalEnemiesDefeated, required: achievement.id === 'warrior' ? 100 : 50 };
          case 'floor_master':
            return { current: state.statistics.highestFloorReached, required: 10 };
          case 'high_roller':
          case 'gambler':
            return { current: state.statistics.totalGoldEarned, required: achievement.id === 'gambler' ? 5000 : 1000 };
          case 'card_collector':
          case 'master_collector':
            return { current: state.cardCollection.unlocked.length, required: achievement.id === 'master_collector' ? 40 : 20 };
          case 'lucky_seven':
            return { current: state.statistics.winStreak, required: 7 };
          default:
            return { current: 0, required: 0 };
        }
      },

      updateStatistics: (stats) => {
        set((state) => ({
          statistics: { ...state.statistics, ...stats },
        }));
      },

      resetMeta: () => {
        set({
          casinoCoins: 0,
          unlockedCharacters: ['gambler'],
          unlockedCards: ['bluff', 'peek', 'fireball', 'heal', 'lucky-charm'],
          cardCollection: {
            unlocked: ['bluff', 'peek', 'fireball', 'heal', 'lucky-charm'],
            maxLevel: {},
            timesUsed: {},
            timesWon: {},
          },
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
            winStreak: 0,
            bestWinStreak: 0,
          },
        });
      },
    }),
    {
      name: 'meta-storage',
    }
  )
);
