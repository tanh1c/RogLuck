import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useDeckStore } from '../../store/deckStore';
import { EnemyDisplay } from './EnemyDisplay';
import { CardHand } from './CardHand';
import { CombatCardDisplay } from './CombatCardDisplay';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { Card } from '../../types/cards';
import { executeCardEffect, getActiveEffectsDisplay } from '../../utils/card-effects';

interface CombatScreenProps {
  onVictory: () => void;
  onDefeat: () => void;
  onFlee: () => void;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({
  onVictory,
  onDefeat,
  onFlee,
}) => {
  const {
    currentEnemy,
    playerTurn,
    combatLog,
    playerHP,
    maxHP,
    activeEffects,
    temporaryBuffs,
    playerDeck,
    setPlayerTurn,
    addCombatLog,
    damageEnemy,
    takeDamage,
    heal,
    applyPassiveEffects: applyPassive,
    applyCardEffect,
  } = useGameStore();

  const { hand, drawCards, discardCard } = useDeckStore();

  // Apply passive effects when combat starts
  React.useEffect(() => {
    if (playerDeck.length > 0) {
      applyPassive(playerDeck);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check for victory/defeat conditions
  React.useEffect(() => {
    if (currentEnemy && currentEnemy.hp <= 0) {
      addCombatLog(`🎉 Defeated ${currentEnemy.name}!`);
      setTimeout(() => onVictory(), 1500);
    }
  }, [currentEnemy?.hp, currentEnemy?.name, onVictory, addCombatLog]);

  React.useEffect(() => {
    if (playerHP <= 0) {
      addCombatLog('💀 You have been defeated...');
      setTimeout(() => onDefeat(), 1500);
    }
  }, [playerHP, onDefeat, addCombatLog]);

  // Draw cards at start of player turn if hand has less than 5 cards
  React.useEffect(() => {
    if (playerTurn && hand.cards.length < 5 && hand.cards.length === 0) {
      drawCards(5);
      addCombatLog('🃏 Drew new cards');
    }
  }, [playerTurn, hand.cards.length, drawCards, addCombatLog]);

  // Apply heal per turn from passive effects
  React.useEffect(() => {
    if (playerTurn && activeEffects.healPerTurn > 0) {
      heal(activeEffects.healPerTurn);
      addCombatLog(`💚 Healed ${activeEffects.healPerTurn} HP from passive effects`);
    }
  }, [playerTurn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Enemy turn AI
  React.useEffect(() => {
    if (!playerTurn && currentEnemy && currentEnemy.hp > 0) {
      const timer = setTimeout(() => {
        // Enemy attacks player
        const damage = Math.floor(Math.random() * 10) + 5; // 5-14 damage
        takeDamage(damage);
        addCombatLog(`⚔️ ${currentEnemy.name} attacks for ${damage} damage!`);

        // Switch back to player turn
        setTimeout(() => {
          setPlayerTurn(true);
          addCombatLog('▶️ Your turn!');
        }, 500);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [playerTurn, currentEnemy, takeDamage, addCombatLog, setPlayerTurn]);

  const handlePlayCard = (card: Card) => {
    if (!playerTurn || !currentEnemy) return;

    // Execute the card effect
    const effectContext = {
      playerHP,
      maxHP,
      enemyHP: currentEnemy.hp,
      gold: 0,
      winRateBonus: activeEffects.winRateBonus,
      damageBonus: activeEffects.damageBonus,
      shield: activeEffects.shield,
      critChance: activeEffects.critChance,
    };

    const result = executeCardEffect(card.effect, effectContext, card.level);

    // Apply the results
    if (result.context.enemyHP < currentEnemy.hp) {
      const damageDealt = currentEnemy.hp - result.context.enemyHP;
      damageEnemy(damageDealt);
      addCombatLog(`⚔️ ${card.name} deals ${damageDealt} damage!`);
    }

    if (result.context.playerHP > playerHP) {
      const healed = result.context.playerHP - playerHP;
      heal(healed);
      addCombatLog(`💚 ${card.name} heals ${healed} HP!`);
    }

    // Apply buff effects
    if (card.effect.type !== 'damage' && card.effect.type !== 'heal') {
      applyCardEffect(card.effect);
      if (card.effect.duration) {
        addCombatLog(`✨ ${card.name} buff applied for ${card.effect.duration} turns!`);
      }
    }

    // Show win rate bonus if applicable
    if (result.context.winRateBonus > activeEffects.winRateBonus) {
      addCombatLog(`🍀 Win rate increased by ${result.context.winRateBonus - activeEffects.winRateBonus}%!`);
    }

    // Discard the played card
    discardCard(card.id);
    addCombatLog(`🃏 Discarded ${card.name}`);

    // End turn
    setPlayerTurn(false);
    addCombatLog('⏳ Enemy turn...');
  };

  const handleEndTurn = () => {
    if (!playerTurn) return;
    setPlayerTurn(false);
    addCombatLog('⏳ Enemy turn...');
  };

  const handleFlee = () => {
    // 50% chance to flee successfully
    const success = Math.random() > 0.5;
    if (success) {
      addCombatLog('🏃 Successfully fled!');
      setTimeout(() => onFlee(), 500);
    } else {
      addCombatLog('❌ Failed to flee!');
      // Enemy gets free attack
      const damage = Math.floor(Math.random() * 8) + 5;
      takeDamage(damage);
      addCombatLog(`⚔️ ${currentEnemy?.name} attacks for ${damage} damage!`);
      setPlayerTurn(false);
    }
  };

  const playerHpPercentage = (playerHP / maxHP) * 100;
  // const enemyHpPercentage = currentEnemy ? (currentEnemy.hp / currentEnemy.maxHp) * 100 : 0;

  // Get active effect displays
  const activeEffectDisplays = getActiveEffectsDisplay(playerDeck);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Combat Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-pixel text-casino-gold mb-2">
            ⚔️ COMBAT ⚔️
          </h2>
          <div className={`text-lg font-pixel ${playerTurn ? 'text-green-400' : 'text-red-400'}`}>
            {playerTurn ? '▶️ Your Turn' : '⏳ Enemy Turn'}
          </div>
        </div>

        {/* Active Effects Display */}
        {activeEffectDisplays.length > 0 && (
          <PixelCard className="p-3 mb-4" variant="default">
            <h4 className="text-xs font-pixel text-casino-gold mb-2">🎯 Active Effects</h4>
            <div className="flex flex-wrap gap-2">
              {activeEffectDisplays.map((effect, idx) => (
                <span key={idx} className="text-xs font-pixel text-green-400 bg-gray-800 px-2 py-1 rounded">
                  {effect}
                </span>
              ))}
            </div>
          </PixelCard>
        )}

        {/* Temporary Buffs Display */}
        {temporaryBuffs.length > 0 && (
          <PixelCard className="p-3 mb-4" variant="purple">
            <h4 className="text-xs font-pixel text-purple-400 mb-2">✨ Temporary Buffs</h4>
            <div className="flex flex-wrap gap-2">
              {temporaryBuffs.map((buff, idx) => (
                <span key={idx} className="text-xs font-pixel text-cyan-400 bg-gray-800 px-2 py-1 rounded">
                  {buff.effect.type}: {buff.effect.value} ({buff.turnsRemaining} turns)
                </span>
              ))}
            </div>
          </PixelCard>
        )}

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
              {/* Shield display */}
              {activeEffects.shield > 0 && (
                <div className="text-xs text-cyan-400 font-pixel mt-1">
                  🛡️ Shield: {activeEffects.shield}
                </div>
              )}
            </div>
          </div>
        </PixelCard>

        {/* Enemy Display */}
        {currentEnemy && (
          <div className="mb-6">
            <EnemyDisplay enemy={currentEnemy} />
          </div>
        )}

        {/* Last Played Card Display */}
        <div className="mb-6">
          <h4 className="text-sm font-pixel text-casino-gold mb-2 text-center">
            🎴 Card Effects
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {playerDeck.slice(0, 4).map((card) => (
              <CombatCardDisplay
                key={card.id}
                card={card}
                isActive={false}
              />
            ))}
          </div>
        </div>

        {/* Player's Hand */}
        <div className="mb-6">
          <CardHand
            cards={hand.cards}
            onPlayCard={handlePlayCard}
            disabled={false}
            playerTurn={playerTurn}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <PixelButton
            onClick={handleEndTurn}
            disabled={!playerTurn}
            variant="secondary"
            className="btn-pixel px-6 py-3"
          >
            ⏭️ End Turn
          </PixelButton>
          <PixelButton
            onClick={handleFlee}
            disabled={!playerTurn}
            variant="danger"
            className="btn-pixel px-6 py-3"
          >
            🏃 Flee
          </PixelButton>
        </div>

        {/* Combat Log */}
        <PixelCard className="p-4" variant="default">
          <h4 className="text-sm font-pixel text-casino-gold mb-2">📜 Combat Log</h4>
          <div className="h-32 overflow-y-auto bg-gray-900 rounded-lg p-2 border-2 border-gray-600">
            {combatLog.length === 0 ? (
              <p className="text-gray-500 text-sm font-pixel">Combat started...</p>
            ) : (
              combatLog.slice(-10).reverse().map((log, index) => (
                <p key={index} className="text-xs md:text-sm text-gray-300 font-pixel mb-1">
                  {log}
                </p>
              ))
            )}
          </div>
        </PixelCard>
      </div>
    </div>
  );
};
