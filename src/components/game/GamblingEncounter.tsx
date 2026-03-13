import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useMetaStore } from '../../store/metaStore';
import { useDeckStore } from '../../store/deckStore';
import { Enemy } from '../../types/game';
import { Card, CARD_DATABASE } from '../../types/cards';
import { PokerGame } from '../gambling/Poker/PokerGame';
import { BlackjackGame } from '../gambling/Blackjack/BlackjackGame';
import { RouletteGame } from '../gambling/Roulette/RouletteGame';
import { DiceGame } from '../gambling/Dice/DiceGame';
import { SlotMachine } from '../gambling/Slot/SlotMachine';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';
import { CardRewards } from './CardRewards';
import { CardUnlockModal } from '../meta/CardUnlockModal';

type GamblingType = 'poker' | 'blackjack' | 'roulette' | 'dice' | 'slot';

interface GamblingEncounterProps {
  enemy: Enemy;
  gamblingType: GamblingType;
  onVictory: () => void;
  onDefeat: () => void;
  onFlee: () => void;
  showCardReward?: boolean;
  roomType?: 'normal' | 'elite' | 'boss';
}

export const GamblingEncounter: React.FC<GamblingEncounterProps> = ({
  enemy,
  gamblingType,
  onVictory,
  onDefeat,
  onFlee,
  showCardReward = false,
  roomType = 'normal',
}) => {
  const { playerHP, maxHP, damageEnemy, takeDamage, addCombatLog } = useGameStore();
  const { unlockCard, updateCardStats } = useMetaStore();
  const { deck: playerDeck, addCard: addCardToDeck } = useDeckStore();

  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'tie' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [newUnlockedCard, setNewUnlockedCard] = useState<Card | null>(null);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [roundKey, setRoundKey] = useState(0);

  const DAMAGE_PER_WIN = 10;
  const PLAYER_DAMAGE_PER_LOSS = 10;

  // Generate random card rewards for elite/boss rooms
  const generateCardRewards = (): string[] => {
    const allCardIds = Object.keys(CARD_DATABASE);
    const shuffled = allCardIds.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const [cardRewardOptions, setCardRewardOptions] = useState<string[]>([]);

  const handleVictory = () => {
    // Track card stats for all cards in deck
    playerDeck?.forEach(card => {
      updateCardStats(card.id, true);
    });

    if (showCardReward && (roomType === 'elite' || roomType === 'boss')) {
      // Generate card reward options
      const rewards = generateCardRewards();
      setCardRewardOptions(rewards);
      setShowReward(true);
    } else {
      onVictory();
    }
  };

  const handleCardRewardSelect = (cardId: string) => {
    const card = CARD_DATABASE[cardId];
    if (!card) return;

    // Unlock card if not already unlocked
    unlockCard(cardId);
    const newCard: Card = { ...card, id: cardId, level: 1, maxLevel: card.maxLevel };
    setNewUnlockedCard(newCard);
    setPendingCardId(cardId);

    // Add card to deck
    addCardToDeck(newCard);

    // Track the card usage
    updateCardStats(cardId, true);
  };

  const handleCollectNewCard = () => {
    setNewUnlockedCard(null);
    setPendingCardId(null);
    setShowReward(false);
    onVictory();
  };

  const handleCloseUnlockModal = () => {
    if (pendingCardId) {
      unlockCard(pendingCardId);
      updateCardStats(pendingCardId, true);
    }
    setNewUnlockedCard(null);
    setPendingCardId(null);
    setShowReward(false);
    onVictory();
  };

  const handleCombatResult = (result: 'win' | 'lose' | 'tie', multiplier?: number) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setGameResult(result);

    const damageMultiplier = multiplier ?? 1;

    if (result === 'win') {
      // Player wins - deal damage to enemy
      const damage = Math.floor(DAMAGE_PER_WIN * damageMultiplier);
      const newEnemyHp = Math.max(0, enemyHp - damage);
      setEnemyHp(newEnemyHp);
      damageEnemy(damage);
      addCombatLog(`🎰 You win! Dealt ${damage} damage to ${enemy.name}!`);

      // Check if enemy is defeated
      if (newEnemyHp <= 0) {
        setTimeout(() => {
          handleVictory();
        }, 1000);
      } else {
        // Reset for next round after delay
        setTimeout(() => {
          setGameResult(null);
          setIsProcessing(false);
          setRoundKey(prev => prev + 1); // Trigger game reset
        }, 1500);
      }
    } else if (result === 'lose') {
      // Player loses - take damage
      takeDamage(PLAYER_DAMAGE_PER_LOSS);
      addCombatLog(`💀 You lose! Took ${PLAYER_DAMAGE_PER_LOSS} damage!`);

      // Track card stats on loss
      playerDeck?.forEach(card => {
        updateCardStats(card.id, false);
      });

      // Check if player is defeated
      if (playerHP - PLAYER_DAMAGE_PER_LOSS <= 0) {
        setTimeout(() => {
          onDefeat();
        }, 1000);
      } else {
        // Reset for next round after delay
        setTimeout(() => {
          setGameResult(null);
          setIsProcessing(false);
          setRoundKey(prev => prev + 1); // Trigger game reset
        }, 1500);
      }
    } else {
      // Tie - no damage
      addCombatLog(`🤝 It's a tie! No damage dealt.`);
      setTimeout(() => {
        setGameResult(null);
        setIsProcessing(false);
        setRoundKey(prev => prev + 1); // Trigger game reset
      }, 1500);
    }
  };

  const handleExit = () => {
    // Exiting during gambling combat counts as fleeing
    onFlee();
  };

  const enemyHpPercentage = (enemyHp / enemy.maxHp) * 100;
  const playerHpPercentage = (playerHP / maxHP) * 100;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Combat Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-pixel text-casino-gold mb-2">
            🎰 GAMBLING COMBAT 🎰
          </h2>
          <div className="text-lg font-pixel text-gray-400">
            {gamblingType === 'poker' ? "🃏 Poker Duel" : gamblingType === 'blackjack' ? "🎴 Blackjack Battle" : gamblingType === 'roulette' ? "🎡 Roulette Roll" : gamblingType === 'dice' ? "🎲 Dice Duel" : "🎰 Slot Battle"}
          </div>
        </div>

        {/* Enemy HP Bar */}
        <PixelCard className="p-4 mb-6" variant="danger">
          <div className="flex items-center gap-4">
            <span className="text-2xl">👹</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-pixel text-white mb-1">
                <span>{enemy.name.toUpperCase()}</span>
                <span>{enemyHp}/{enemy.maxHp}</span>
              </div>
              <div className="w-full bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600">
                <div
                  className="h-4 bg-red-500 transition-all duration-300"
                  style={{ width: `${enemyHpPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Player HP Bar */}
        <PixelCard className="p-4 mb-6" variant="default">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🧙</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-pixel text-white mb-1">
                <span>YOU</span>
                <span>{playerHP}/{maxHP}</span>
              </div>
              <div className="w-full bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600">
                <div
                  className="h-4 bg-blue-500 transition-all duration-300"
                  style={{ width: `${playerHpPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Damage/Heal Indicator */}
        {gameResult && (
          <div className="text-center mb-4">
            <div className={`text-2xl font-pixel ${
              gameResult === 'win'
                ? 'text-pixel-green animate-bounce'
                : gameResult === 'lose'
                ? 'text-pixel-red animate-pulse'
                : 'text-yellow-500'
            }`}>
              {gameResult === 'win'
                ? `💥 DEALT ${DAMAGE_PER_WIN}+ DAMAGE!`
                : gameResult === 'lose'
                ? `💔 TOOK ${PLAYER_DAMAGE_PER_LOSS} DAMAGE!`
                : '🤝 TIE - NO DAMAGE'}
            </div>
          </div>
        )}

        {/* Gambling Game */}
        <div className="mb-6">
          {gamblingType === 'poker' ? (
            <PokerGame
              combatMode={true}
              onResult={() => {}}
              onCombatResult={handleCombatResult}
              roundKey={roundKey}
            />
          ) : gamblingType === 'blackjack' ? (
            <BlackjackGame
              combatMode={true}
              onResult={() => {}}
              onCombatResult={handleCombatResult}
              roundKey={roundKey}
            />
          ) : gamblingType === 'roulette' ? (
            <RouletteGame
              combatMode={true}
              onResult={() => {}}
              onCombatResult={handleCombatResult}
              onExit={handleExit}
              roundKey={roundKey}
            />
          ) : gamblingType === 'dice' ? (
            <DiceGame
              combatMode={true}
              onResult={() => {}}
              onCombatResult={handleCombatResult}
              onExit={handleExit}
              roundKey={roundKey}
            />
          ) : (
            <SlotMachine
              combatMode={true}
              onResult={() => {}}
              onCombatResult={handleCombatResult}
              onExit={handleExit}
              roundKey={roundKey}
            />
          )}
        </div>

        {/* Flee Button */}
        <div className="text-center mt-4">
          <PixelButton
            onClick={onFlee}
            disabled={isProcessing}
            variant="secondary"
            className="btn-pixel px-6 py-3"
          >
            🏃 Flee
          </PixelButton>
        </div>
      </div>

      {/* Card Reward Selection */}
      {showReward && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <CardRewards
            options={cardRewardOptions}
            onSelect={handleCardRewardSelect}
          />
        </div>
      )}

      {/* New Card Unlock Modal */}
      {newUnlockedCard && (
        <CardUnlockModal
          card={newUnlockedCard}
          onCollect={handleCollectNewCard}
          onClose={handleCloseUnlockModal}
        />
      )}
    </div>
  );
};
