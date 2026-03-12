import { Card } from './cards';

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
  // Combat state
  currentEnemy: Enemy | null;
  playerTurn: boolean;
  combatLog: string[];
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
