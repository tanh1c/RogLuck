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
