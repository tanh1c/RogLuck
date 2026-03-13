import { create } from 'zustand';
import { GameState, Room, Enemy } from '../types/game';
import { Card, CardEffect } from '../types/cards';

// Active effects interface
export interface ActiveEffects {
  winRateBonus: number;
  damageBonus: number;
  shield: number;
  critChance: number;
  healPerTurn: number;
}

// Extended GameState with card effects
export interface GameStateWithEffects extends GameState {
  // Card effect state
  activeEffects: ActiveEffects;
  activeEffectTurns: number;
  playerDeck: Card[];

  // Temporary buffs from cards
  temporaryBuffs: {
    effect: CardEffect;
    turnsRemaining: number;
  }[];
}

interface GameActions {
  startNewRun: (characterClass: string) => void;
  loadGame: (savedState: Partial<GameState>) => void;
  nextFloor: () => void;
  enterRoom: (room: Room) => void;
  leaveRoom: () => void;
  startCombat: (enemy: Enemy) => void;
  endCombat: (victory: boolean) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => void;
  setGameOver: (victory: boolean) => void;
  resetGame: () => void;
  // Combat actions
  setCurrentEnemy: (enemy: Enemy | null) => void;
  setPlayerTurn: (turn: boolean) => void;
  addCombatLog: (message: string) => void;
  damageEnemy: (amount: number) => void;
  // Card effect actions
  applyCardEffect: (effect: CardEffect) => void;
  applyPassiveEffects: (cards: Card[]) => void;
  clearActiveEffects: () => void;
  decrementEffectTurns: () => void;
  addTemporaryBuff: (effect: CardEffect, turns: number) => void;
  setPlayerDeck: (deck: Card[]) => void;
  getActiveEffects: () => ActiveEffects;
}

const initialActiveEffects: ActiveEffects = {
  winRateBonus: 0,
  damageBonus: 0,
  shield: 0,
  critChance: 0,
  healPerTurn: 0,
};

const initialGameState: GameStateWithEffects = {
  currentFloor: 1,
  maxFloor: 10,
  currentRoom: null,
  playerHP: 100,
  maxHP: 100,
  gold: 50,
  isCombat: false,
  isGameOver: false,
  isVictory: false,
  // Combat state
  currentEnemy: null,
  playerTurn: true,
  combatLog: [],
  // Card effect state
  activeEffects: initialActiveEffects,
  activeEffectTurns: 0,
  playerDeck: [],
  temporaryBuffs: [],
};

export const useGameStore = create<GameStateWithEffects & GameActions>((set, get) => ({
  ...initialGameState,

  startNewRun: (_characterClass) => {
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
    set({
      isCombat: true,
      currentEnemy: enemy,
      activeEffects: initialActiveEffects,
      temporaryBuffs: [],
    });
  },

  endCombat: (victory) => {
    // Apply on_win effects if victorious
    if (victory) {
      const { playerDeck } = get();
      const onWinEffects = playerDeck.filter(
        card => card.effect.trigger === 'on_win'
      );

      if (onWinEffects.length > 0) {
        onWinEffects.forEach(card => {
          if (card.effect.type === 'steal_gold') {
            set(state => ({ gold: state.gold + card.effect.value }));
          }
        });
      }
    }

    set({
      isCombat: false,
      currentEnemy: null,
      activeEffects: initialActiveEffects,
      temporaryBuffs: [],
    });
  },

  takeDamage: (amount) => {
    set((state) => {
      // Apply shield first
      let damageAfterShield = amount;
      let remainingShield = state.activeEffects.shield;

      if (remainingShield > 0) {
        if (remainingShield >= damageAfterShield) {
          remainingShield -= damageAfterShield;
          damageAfterShield = 0;
        } else {
          damageAfterShield -= remainingShield;
          remainingShield = 0;
        }
      }

      const newHP = Math.max(0, state.playerHP - damageAfterShield);
      if (newHP === 0) {
        return {
          playerHP: 0,
          isGameOver: true,
          isVictory: false,
          activeEffects: { ...state.activeEffects, shield: remainingShield }
        };
      }
      return {
        playerHP: newHP,
        activeEffects: { ...state.activeEffects, shield: remainingShield }
      };
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

  setGameOver: (gameOver) => {
    set({ isGameOver: gameOver });
  },

  resetGame: () => {
    set(initialGameState);
  },

  // Combat actions
  setCurrentEnemy: (enemy) => {
    set({ currentEnemy: enemy });
  },

  setPlayerTurn: (turn) => {
    set({ playerTurn: turn });
  },

  addCombatLog: (message) => {
    set((state) => ({
      combatLog: [...state.combatLog, message].slice(-50), // Keep last 50 messages
    }));
  },

  damageEnemy: (amount) => {
    set((state) => {
      if (!state.currentEnemy) return state;

      // Apply damage bonus from active effects
      const totalDamage = amount + state.activeEffects.damageBonus;

      const newHp = Math.max(0, state.currentEnemy.hp - totalDamage);
      return {
        currentEnemy: {
          ...state.currentEnemy,
          hp: newHp,
        },
      };
    });
  },

  // Card effect actions
  applyCardEffect: (effect: CardEffect) => {
    set((state) => {
      const newEffects = { ...state.activeEffects };

      switch (effect.type) {
        case 'buff_win_rate':
          if (effect.duration) {
            // Temporary buff
            return {
              ...state,
              temporaryBuffs: [
                ...state.temporaryBuffs,
                { effect, turnsRemaining: effect.duration }
              ]
            };
          }
          newEffects.winRateBonus += effect.value;
          break;

        case 'extra_damage':
          if (effect.duration) {
            return {
              ...state,
              temporaryBuffs: [
                ...state.temporaryBuffs,
                { effect, turnsRemaining: effect.duration }
              ]
            };
          }
          newEffects.damageBonus += effect.value;
          break;

        case 'shield':
          newEffects.shield += effect.value;
          break;

        case 'crit_boost':
          newEffects.critChance += effect.value;
          break;

        case 'heal':
          if (effect.duration) {
            return {
              ...state,
              temporaryBuffs: [
                ...state.temporaryBuffs,
                { effect, turnsRemaining: effect.duration }
              ]
            };
          }
          newEffects.healPerTurn += effect.value;
          break;
      }

      return { activeEffects: newEffects };
    });
  },

  applyPassiveEffects: (cards: Card[]) => {
    const passiveCards = cards.filter(card => card.effect.trigger === 'passive');

    set((_state) => {
      const newEffects = { ...initialActiveEffects };

      passiveCards.forEach(card => {
        const effect = card.effect;
        const levelMultiplier = 1 + (card.level - 1) * 0.2;
        const scaledValue = Math.floor(effect.value * levelMultiplier);

        switch (effect.type) {
          case 'buff_win_rate':
            newEffects.winRateBonus += scaledValue;
            break;
          case 'extra_damage':
            newEffects.damageBonus += scaledValue;
            break;
          case 'heal':
            newEffects.healPerTurn += scaledValue;
            break;
          case 'crit_boost':
            newEffects.critChance += scaledValue;
            break;
          case 'steal_gold':
            // Handled separately in addGold
            break;
        }
      });

      return { activeEffects: newEffects };
    });
  },

  clearActiveEffects: () => {
    set({
      activeEffects: initialActiveEffects,
      temporaryBuffs: []
    });
  },

  decrementEffectTurns: () => {
    set((state) => {
      const remainingBuffs = state.temporaryBuffs
        .map(buff => ({
          ...buff,
          turnsRemaining: buff.turnsRemaining - 1
        }))
        .filter(buff => buff.turnsRemaining > 0);

      // Recalculate active effects from remaining temporary buffs
      const newEffects = { ...initialActiveEffects };

      remainingBuffs.forEach(buff => {
        const effect = buff.effect;
        switch (effect.type) {
          case 'buff_win_rate':
            newEffects.winRateBonus += effect.value;
            break;
          case 'extra_damage':
            newEffects.damageBonus += effect.value;
            break;
          case 'heal':
            newEffects.healPerTurn += effect.value;
            break;
          case 'crit_boost':
            newEffects.critChance += effect.value;
            break;
        }
      });

      return {
        temporaryBuffs: remainingBuffs,
        activeEffects: newEffects
      };
    });
  },

  addTemporaryBuff: (effect: CardEffect, turns: number) => {
    set((state) => ({
      temporaryBuffs: [...state.temporaryBuffs, { effect, turnsRemaining: turns }]
    }));
  },

  setPlayerDeck: (deck: Card[]) => {
    set({ playerDeck: deck });
  },

  getActiveEffects: () => {
    return get().activeEffects;
  },
}));
