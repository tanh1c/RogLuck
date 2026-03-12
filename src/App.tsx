import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useDeckStore } from './store/deckStore';
import { useMetaStore, ACHIEVEMENTS } from './store/metaStore';
import { HUD } from './components/layout/HUD';
import { GameLayout } from './components/layout/GameLayout';
import { MainMenu } from './components/layout/MainMenu';
import { CharacterSelect } from './components/layout/CharacterSelect';
import { FloorMap } from './components/game/FloorMap';
import { GamblingEncounter } from './components/game/GamblingEncounter';
import { MetaShop } from './components/meta/MetaShop';
import { CharacterUnlockScreen } from './components/meta/CharacterUnlockScreen';
import { Statistics } from './components/meta/Statistics';
import { Achievements } from './components/meta/Achievements';
import { AchievementNotification } from './components/meta/AchievementNotification';
import { PixelButton } from './components/ui/PixelButton';
import { CHARACTER_CLASSES, CharacterClass } from './types/characters';
import { Room } from './types/game';
import { generateFloor } from './utils/floor-generator';
import './App.css';

type Screen = 'menu' | 'character-select' | 'game' | 'floor-map' | 'gambling-encounter' | 'collection' | 'shop' | 'meta-shop' | 'character-unlock' | 'statistics' | 'achievements';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [showMetaShop, setShowMetaShop] = useState(false);
  const [showCharacterUnlock, setShowCharacterUnlock] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [newAchievement, setNewAchievement] = useState<{
    name: string;
    description: string;
    reward: number;
    icon: string;
  } | null>(null);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(-1);
  const [visitedRoomIndices, setVisitedRoomIndices] = useState<number[]>([]);
  const [gamblingType, setGamblingType] = useState<'poker' | 'blackjack' | 'roulette' | 'dice' | 'slot'>('poker');
  const { startNewRun, isGameOver, addGold, setCurrentEnemy, setPlayerTurn, addCombatLog, setGameOver } = useGameStore();
  const { initializeDeck } = useDeckStore();
  const { addCasinoCoins, casinoCoins, checkAchievements, updateStatistics, statistics } = useMetaStore();

  const shouldShowSidebar = currentScreen === 'floor-map' || currentScreen === 'gambling-encounter';

  const handleCharacterSelect = (character: CharacterClass) => {
    startNewRun(character);
    const charData = CHARACTER_CLASSES[character];
    initializeDeck(charData.startingDeck);
    // Generate first floor
    const firstFloorRooms = generateFloor(1);
    setRooms(firstFloorRooms);
    setCurrentFloor(1);
    setCurrentRoomIndex(0);
    setVisitedRoomIndices([]);
    setCurrentScreen('floor-map');
  };

  const handleEnterRoom = (roomIndex: number) => {
    setCurrentRoomIndex(roomIndex);
    // Mark room as visited
    if (!visitedRoomIndices.includes(roomIndex)) {
      setVisitedRoomIndices([...visitedRoomIndices, roomIndex]);
    }

    // Check if room has enemy and is gambling room - start gambling encounter
    const room = rooms[roomIndex];
    if (room && room.enemy) {
      if (room.type === 'gambling') {
        // Randomly select poker, blackjack, roulette, dice, or slot
        const rand = Math.random();
        if (rand < 0.2) setGamblingType('poker');
        else if (rand < 0.4) setGamblingType('blackjack');
        else if (rand < 0.6) setGamblingType('roulette');
        else if (rand < 0.8) setGamblingType('dice');
        else setGamblingType('slot');
        setCurrentEnemy(room.enemy);
        setPlayerTurn(true);
        addCombatLog(`🎰 Entering gambling combat with ${room.enemy.name}!`);
        setCurrentScreen('gambling-encounter');
      }
    } else if (room && room.type === 'treasure' && room.reward) {
      // Treasure room - collect reward immediately
      if (room.reward.type === 'gold' && room.reward.amount) {
        addGold(room.reward.amount);
        addCombatLog(`💰 Collected ${room.reward.amount} gold from treasure room!`);
      } else if (room.reward.type === 'card' && room.reward.card) {
        // Add card to collection
        const { unlockCard } = useMetaStore.getState();
        unlockCard(room.reward.card.id);
        addCombatLog(`🃏 Discovered card: ${room.reward.card.name}!`);
      } else if (room.reward.type === 'relic' && room.reward.relic) {
        addCombatLog(`✨ Found relic: ${room.reward.relic.name}! (Not yet implemented)`);
      }
      // Clear the reward so it's only collected once
      room.reward = undefined;
      setRooms([...rooms]);
    } else if (room && room.type === 'rest') {
      // Rest room - heal player
      const { heal } = useGameStore.getState();
      heal(30);
      addCombatLog('💤 Rested and restored 30 HP!');
    } else if (room && room.type === 'shop') {
      // Shop room - open meta shop
      setCurrentScreen('meta-shop');
    } else if (room && room.type === 'elite' && room.enemy) {
      // Elite room - start elite gambling encounter
      const rand = Math.random();
      if (rand < 0.25) setGamblingType('poker');
      else if (rand < 0.5) setGamblingType('blackjack');
      else if (rand < 0.75) setGamblingType('roulette');
      else if (rand < 1) setGamblingType('dice');
      setCurrentEnemy(room.enemy);
      setPlayerTurn(true);
      addCombatLog(`⚔️ Entering ELITE combat with ${room.enemy.name}!`);
      setCurrentScreen('gambling-encounter');
    } else if (room && room.type === 'boss' && room.enemy) {
      // Boss room - start boss gambling encounter (always poker for final battle)
      setGamblingType('poker');
      setCurrentEnemy(room.enemy);
      setPlayerTurn(true);
      addCombatLog(`👹 BOSS BATTLE with ${room.enemy.name}!`);
      setCurrentScreen('gambling-encounter');
    }
  };

  const handleNextFloor = () => {
    const nextFloor = currentFloor + 1;
    if (nextFloor > 10) {
      // Victory condition - completed all floors
      updateStatistics({
        runsPlayed: statistics.runsPlayed + 1,
        runsWon: statistics.runsWon + 1,
        highestFloorReached: Math.max(statistics.highestFloorReached, 10),
        winStreak: 0, // Reset win streak after complete run
      });
      checkAndNotifyAchievements();
      setCurrentScreen('menu');
      return;
    }
    const newRooms = generateFloor(nextFloor);
    setRooms(newRooms);
    setCurrentFloor(nextFloor);
    setCurrentRoomIndex(0);
    setVisitedRoomIndices([]);

    // Update highest floor reached
    updateStatistics({
      highestFloorReached: Math.max(statistics.highestFloorReached, nextFloor),
    });
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleOpenMetaShop = () => {
    setShowMetaShop(true);
  };

  const handleCloseMetaShop = () => {
    setShowMetaShop(false);
  };

  const handleOpenCharacterUnlock = () => {
    setShowCharacterUnlock(true);
  };

  const handleCloseCharacterUnlock = () => {
    setShowCharacterUnlock(false);
  };

  const handleOpenStatistics = () => {
    setCurrentScreen('statistics');
    setShowStatistics(true);
  };

  const handleCloseStatistics = () => {
    setShowStatistics(false);
    setCurrentScreen('menu');
  };

  const handleOpenAchievements = () => {
    setCurrentScreen('achievements');
    setShowAchievements(true);
  };

  const handleCloseAchievements = () => {
    setShowAchievements(false);
    setCurrentScreen('menu');
  };

  const handleDismissAchievement = () => {
    setNewAchievement(null);
  };

  const checkAndNotifyAchievements = () => {
    const newlyUnlocked = checkAchievements();
    if (newlyUnlocked.length > 0) {
      // Show notification for the first newly unlocked achievement
      const achievement = ACHIEVEMENTS.find((a) => a.id === newlyUnlocked[0]);
      if (achievement) {
        setNewAchievement({
          name: achievement.name,
          description: achievement.description,
          reward: achievement.reward,
          icon: achievement.icon,
        });
      }
    }
  };

  // Gambling encounter handlers
  const handleGamblingVictory = () => {
    const room = rooms[currentRoomIndex];
    if (room && room.reward && room.reward.type === 'gold' && room.reward.amount) {
      addGold(room.reward.amount);
      addCombatLog(`💰 Victory! Earned ${room.reward.amount} gold!`);
    } else {
      addGold(20);
      addCombatLog('💰 Victory! Earned 20 gold!');
    }
    // Earn Casino Coins based on enemy HP (1 coin per 10 HP)
    const enemy = room?.enemy;
    if (enemy) {
      const coinsEarned = Math.floor(enemy.maxHp / 10);
      addCasinoCoins(coinsEarned);
      addCombatLog(`🪙 Earned ${coinsEarned} Casino Coins!`);
    }

    // Update statistics
    updateStatistics({
      totalGoldEarned: statistics.totalGoldEarned + (room?.reward?.amount || 20),
      totalEnemiesDefeated: statistics.totalEnemiesDefeated + 1,
      winStreak: statistics.winStreak + 1,
      bestWinStreak: Math.max(statistics.bestWinStreak, statistics.winStreak + 1),
    });

    // Check for achievements
    checkAndNotifyAchievements();

    // Return to floor map
    setCurrentScreen('floor-map');
  };

  const handleGamblingDefeat = () => {
    // Update statistics for loss
    updateStatistics({
      runsPlayed: statistics.runsPlayed + 1,
      winStreak: 0, // Reset win streak on loss
    });

    // Check achievements even on loss (for runsPlayed etc.)
    checkAndNotifyAchievements();

    setGameOver(false); // Player lost all HP, game over
    // Game over screen will show automatically via isGameOver
  };

  const handleGamblingFlee = () => {
    // 50% chance to flee successfully
    const success = Math.random() > 0.5;
    if (success) {
      addCombatLog('🏃 Successfully fled from gambling combat!');
      setCurrentScreen('floor-map');
    } else {
      addCombatLog('❌ Failed to flee! Enemy attacks!');
      // Take damage as penalty
      const { takeDamage } = useGameStore.getState();
      takeDamage(5);
      // Stay in gambling encounter
    }
  };

  const canProceedToNextFloor = visitedRoomIndices.length === rooms.length && rooms.length > 0;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-pixel text-casino-gold mb-4">
                🎰 Dungeon Casino Rogue
              </h1>
              <p className="text-gray-400 mb-8">Pixel Art Roguelike + Gambling</p>
              <MainMenu
                onNewGame={() => setCurrentScreen('character-select')}
                onContinue={() => {}}
                onShop={handleOpenMetaShop}
                onStats={handleOpenStatistics}
                onAchievements={handleOpenAchievements}
                onCharacterUnlocks={handleOpenCharacterUnlock}
              />
              {/* Casino Coins Display */}
              <div className="mt-8 text-sm font-pixel text-casino-gold">
                💰 Casino Coins: {casinoCoins}
              </div>
            </div>
          </div>
        );

      case 'character-select':
        return (
          <div className="min-h-screen py-8">
            <CharacterSelect
              onCharacterSelected={handleCharacterSelect}
              onBack={() => setCurrentScreen('menu')}
            />
          </div>
        );

      case 'game':
        return (
          <div className="min-h-screen py-8">
            <div className="text-center">
              <h2 className="text-xl font-pixel text-casino-gold mb-4">
                🎮 Game Screen
              </h2>
              <p className="text-gray-400 mb-8">
                Dungeon Casino - Floor {currentFloor}
              </p>
              <div className="flex flex-col gap-4 items-center">
                <PixelButton
                  onClick={() => setCurrentScreen('floor-map')}
                  variant="primary"
                  className="btn-pixel"
                >
                  🗺️ Open Floor Map
                </PixelButton>
                <PixelButton
                  onClick={handleBackToMenu}
                  variant="secondary"
                  className="btn-pixel"
                >
                  Back to Menu
                </PixelButton>
              </div>
            </div>
          </div>
        );

      case 'floor-map':
        return (
          <GameLayout
            rooms={rooms}
            currentRoomIndex={currentRoomIndex}
            visitedRoomIndices={visitedRoomIndices}
            showSidebar={true}
          >
            <FloorMap
              floorNumber={currentFloor}
              rooms={rooms}
              currentRoomIndex={currentRoomIndex}
              visitedRoomIndices={visitedRoomIndices}
              onRoomEnter={handleEnterRoom}
              onNextFloor={handleNextFloor}
              canProceedToNextFloor={canProceedToNextFloor}
            />
            <div className="text-center mt-8">
              <PixelButton
                onClick={handleBackToMenu}
                variant="secondary"
                className="btn-pixel"
              >
                Back to Menu
              </PixelButton>
            </div>
          </GameLayout>
        );

      case 'gambling-encounter':
        const room = rooms[currentRoomIndex];
        return (
          <GameLayout
            rooms={rooms}
            currentRoomIndex={currentRoomIndex}
            visitedRoomIndices={visitedRoomIndices}
            showSidebar={true}
          >
            {room && room.enemy ? (
              <GamblingEncounter
                enemy={room.enemy}
                gamblingType={gamblingType}
                onVictory={handleGamblingVictory}
                onDefeat={handleGamblingDefeat}
                onFlee={handleGamblingFlee}
              />
            ) : (
              <div className="text-center">
                <p className="text-red-500 font-pixel">No enemy found!</p>
                <PixelButton
                  onClick={() => setCurrentScreen('floor-map')}
                  variant="primary"
                  className="btn-pixel mt-4"
                >
                  Back to Map
                </PixelButton>
              </div>
            )}
          </GameLayout>
        );

      case 'statistics':
        return showStatistics ? (
          <Statistics onClose={handleCloseStatistics} />
        ) : null;

      case 'achievements':
        return showAchievements ? (
          <Achievements onClose={handleCloseAchievements} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="font-pixel">
      {currentScreen !== 'menu' && !shouldShowSidebar && <HUD />}
      <main>{renderScreen()}</main>

      {isGameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-casino-purple p-8 rounded-lg text-center pixel-border">
            <h2 className="text-2xl font-pixel mb-4">💀 Game Over</h2>
            <button
              onClick={() => setCurrentScreen('menu')}
              className="px-6 py-3 bg-casino-gold text-casino-dark font-pixel rounded-lg btn-pixel"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}

      {showMetaShop && (
        <MetaShop onClose={handleCloseMetaShop} />
      )}

      {showCharacterUnlock && (
        <CharacterUnlockScreen onClose={handleCloseCharacterUnlock} />
      )}

      {showStatistics && currentScreen !== 'statistics' && (
        <Statistics onClose={handleCloseStatistics} />
      )}

      {showAchievements && currentScreen !== 'achievements' && (
        <Achievements onClose={handleCloseAchievements} />
      )}

      {newAchievement && (
        <AchievementNotification
          achievement={newAchievement}
          onDismiss={handleDismissAchievement}
        />
      )}
    </div>
  );
}

export default App;
