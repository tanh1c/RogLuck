import { useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useDeckStore } from '../store/deckStore';
import { useMetaStore } from '../store/metaStore';

const SAVE_KEY = 'rogluck_game_save';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function useSaveLoad() {
  const gameState = useGameStore();
  const deckState = useDeckStore();
  const metaState = useMetaStore();

  const saveGame = useCallback(() => {
    const saveData = {
      gameState: {
        currentFloor: gameState.currentFloor,
        playerHP: gameState.playerHP,
        maxHP: gameState.maxHP,
        gold: gameState.gold,
        isGameOver: gameState.isGameOver,
      },
      deck: deckState.cards,
      meta: {
        casinoCoins: metaState.casinoCoins,
        unlockedCharacters: metaState.unlockedCharacters,
        cardCollection: metaState.cardCollection,
        statistics: metaState.statistics,
        achievements: metaState.achievements,
      },
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      console.log('Game saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }, [gameState, deckState, metaState]);

  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }, []);

  const deleteSave = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    console.log('Save deleted');
  }, []);

  const hasSave = useCallback(() => {
    return localStorage.getItem(SAVE_KEY) !== null;
  }, []);

  // Auto-save on interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.currentFloor > 0 && !gameState.isGameOver) {
        saveGame();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.currentFloor, gameState.isGameOver, saveGame]);

  // Auto-save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gameState.currentFloor > 0 && !gameState.isGameOver) {
        saveGame();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState.currentFloor, gameState.isGameOver, saveGame]);

  return { saveGame, loadGame, deleteSave, hasSave };
}
