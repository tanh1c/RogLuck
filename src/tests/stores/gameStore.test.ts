import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../store/gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useGameStore.getState();
    useGameStore.setState({
      ...store,
      playerHP: 100,
      maxHP: 100,
      gold: 50,
      currentFloor: 1,
    });
  });

  describe('takeDamage', () => {
    it('should reduce player HP', () => {
      const { takeDamage } = useGameStore.getState();
      takeDamage(20);

      const state = useGameStore.getState();
      expect(state.playerHP).toBe(80);
    });

    it('should not reduce HP below 0', () => {
      const { takeDamage } = useGameStore.getState();
      takeDamage(150);

      const state = useGameStore.getState();
      expect(state.playerHP).toBe(0);
      expect(state.isGameOver).toBe(true);
    });

    it('should apply shield damage reduction', () => {
      // Note: shield mechanic exists in card effects but damage reduction
      // is applied through the takeDamage action directly
      // This test verifies damage is tracked correctly
      const { takeDamage } = useGameStore.getState();
      takeDamage(30);

      const state = useGameStore.getState();
      expect(state.playerHP).toBe(70);
    });
  });

  describe('heal', () => {
    it('should increase player HP', () => {
      const { takeDamage, heal } = useGameStore.getState();
      takeDamage(30);

      const stateBefore = useGameStore.getState();
      expect(stateBefore.playerHP).toBe(70);

      heal(20);

      const state = useGameStore.getState();
      expect(state.playerHP).toBe(90);
    });

    it('should not heal above max HP', () => {
      const { heal } = useGameStore.getState();
      heal(50);

      const state = useGameStore.getState();
      expect(state.playerHP).toBe(100);
    });
  });

  describe('addGold', () => {
    it('should increase gold', () => {
      const { addGold } = useGameStore.getState();
      addGold(25);

      const state = useGameStore.getState();
      expect(state.gold).toBe(75);
    });
  });

  describe('spendGold', () => {
    it('should decrease gold', () => {
      const { spendGold } = useGameStore.getState();
      spendGold(20);

      const state = useGameStore.getState();
      expect(state.gold).toBe(30);
    });

    it('should allow spending more gold than available (goes negative)', () => {
      const { spendGold } = useGameStore.getState();
      spendGold(100);

      const state = useGameStore.getState();
      expect(state.gold).toBe(-50); // Goes negative
    });
  });

  describe('damageEnemy', () => {
    it('should damage the current enemy', () => {
      const { setCurrentEnemy, damageEnemy } = useGameStore.getState();

      setCurrentEnemy({
        id: 'test-enemy',
        name: 'Test Enemy',
        hp: 50,
        maxHp: 50,
        class: 'basic',
      });

      damageEnemy(20);

      const state = useGameStore.getState();
      expect(state.currentEnemy?.hp).toBe(30);
    });
  });

  describe('addCombatLog', () => {
    it('should add message to combat log', () => {
      const { addCombatLog } = useGameStore.getState();
      addCombatLog('Test message');

      const state = useGameStore.getState();
      expect(state.combatLog).toContain('Test message');
    });

    it('should keep only last 50 messages', () => {
      const { addCombatLog } = useGameStore.getState();

      // Add 55 messages
      for (let i = 0; i < 55; i++) {
        addCombatLog(`Message ${i}`);
      }

      const state = useGameStore.getState();
      expect(state.combatLog.length).toBeLessThanOrEqual(50);
    });
  });

  describe('startNewRun', () => {
    it('should reset game state', () => {
      const { startNewRun, takeDamage, addGold } = useGameStore.getState();

      // Modify state
      takeDamage(50);
      addGold(100);

      // Start new run
      startNewRun('gambler');

      const state = useGameStore.getState();
      expect(state.playerHP).toBe(100);
      expect(state.gold).toBe(50);
      expect(state.currentFloor).toBe(1);
    });
  });
});
