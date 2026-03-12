export type CardType = 'technique' | 'ability' | 'modifier';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

// Card effect types
export type CardEffectType =
  | 'damage'
  | 'heal'
  | 'buff_win_rate'
  | 'extra_damage'
  | 'shield'
  | 'steal_gold'
  | 'crit_boost';

// Card effect trigger conditions
export type CardEffectTrigger = 'on_play' | 'on_win' | 'on_loss' | 'passive';

// Card effect definition
export interface CardEffect {
  type: CardEffectType;
  value: number;
  duration?: number; // turns, if applicable
  trigger: CardEffectTrigger;
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  description: string;
  effect: CardEffect;
  rarity: CardRarity;
  level: number;
  maxLevel: number;
  cost?: number; // Energy cost, if implemented later
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
    effect: { type: 'extra_damage', value: 5, trigger: 'on_play' },
    rarity: 'common',
    maxLevel: 3,
  },
  'double-down': {
    name: 'Double Down',
    type: 'technique',
    description: 'Double your bet, win 2x',
    effect: { type: 'extra_damage', value: 10, trigger: 'on_win' },
    rarity: 'uncommon',
    maxLevel: 3,
  },
  'peek': {
    name: 'Peek',
    type: 'technique',
    description: 'See 1 opponent card',
    effect: { type: 'buff_win_rate', value: 10, duration: 1, trigger: 'on_play' },
    rarity: 'uncommon',
    maxLevel: 3,
  },
  'quick-draw': {
    name: 'Quick Draw',
    type: 'technique',
    description: 'Strike first with precision',
    effect: { type: 'damage', value: 8, trigger: 'on_play' },
    rarity: 'common',
    maxLevel: 3,
  },
  'all-in': {
    name: 'All In',
    type: 'technique',
    description: 'Risk everything for glory',
    effect: { type: 'extra_damage', value: 20, trigger: 'on_play' },
    rarity: 'rare',
    maxLevel: 3,
  },
  // Ability Cards
  'fireball': {
    name: 'Fireball',
    type: 'ability',
    description: 'Deal 15 damage directly',
    effect: { type: 'damage', value: 15, trigger: 'on_play' },
    rarity: 'common',
    maxLevel: 3,
  },
  'heal': {
    name: 'Heal',
    type: 'ability',
    description: 'Recover 20 HP',
    effect: { type: 'heal', value: 20, trigger: 'on_play' },
    rarity: 'common',
    maxLevel: 3,
  },
  'ice-shield': {
    name: 'Ice Shield',
    type: 'ability',
    description: 'Gain temporary shield',
    effect: { type: 'shield', value: 15, duration: 2, trigger: 'on_play' },
    rarity: 'uncommon',
    maxLevel: 3,
  },
  'shadow-strike': {
    name: 'Shadow Strike',
    type: 'ability',
    description: 'Deal critical damage',
    effect: { type: 'crit_boost', value: 25, trigger: 'on_play' },
    rarity: 'rare',
    maxLevel: 3,
  },
  'divine-light': {
    name: 'Divine Light',
    type: 'ability',
    description: 'Heal and damage enemy',
    effect: { type: 'heal', value: 15, trigger: 'on_play' },
    rarity: 'rare',
    maxLevel: 3,
  },
  // Modifier Cards
  'lucky-charm': {
    name: 'Lucky Charm',
    type: 'modifier',
    description: '+10% win rate passively',
    effect: { type: 'buff_win_rate', value: 10, trigger: 'passive' },
    rarity: 'uncommon',
    maxLevel: 3,
  },
  'hot-streak': {
    name: 'Hot Streak',
    type: 'modifier',
    description: 'Consecutive wins = bonus gold',
    effect: { type: 'steal_gold', value: 5, trigger: 'on_win' },
    rarity: 'rare',
    maxLevel: 3,
  },
  'thieves-tools': {
    name: 'Thieves Tools',
    type: 'modifier',
    description: 'Steal gold from enemies',
    effect: { type: 'steal_gold', value: 3, trigger: 'passive' },
    rarity: 'common',
    maxLevel: 3,
  },
  'berserker-rage': {
    name: 'Berserker Rage',
    type: 'modifier',
    description: 'More damage when low on HP',
    effect: { type: 'extra_damage', value: 5, trigger: 'passive' },
    rarity: 'uncommon',
    maxLevel: 3,
  },
  'crystal-heart': {
    name: 'Crystal Heart',
    type: 'modifier',
    description: 'Passive HP regeneration',
    effect: { type: 'heal', value: 3, trigger: 'passive' },
    rarity: 'rare',
    maxLevel: 3,
  },
  'dragons-blessing': {
    name: 'Dragons Blessing',
    type: 'modifier',
    description: 'All effects amplified',
    effect: { type: 'crit_boost', value: 15, trigger: 'passive' },
    rarity: 'legendary',
    maxLevel: 3,
  },
};
