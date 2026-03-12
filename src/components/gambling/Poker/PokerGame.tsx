import React, { useState } from 'react';
import { PokerCard as CardType, createDeck, shuffleDeck, drawCards, evaluateHand, determineWinner } from '../../../utils/gambling-logic/poker';
import { PokerCard } from './PokerCard';
import { PixelButton } from '../../ui/PixelButton';
import { PixelCard } from '../../ui/PixelCard';

interface PokerGameProps {
  onResult: (result: 'win' | 'lose' | 'tie') => void;
  onExit: () => void;
  // Combat mode props
  combatMode?: boolean;
  onCombatResult?: (result: 'win' | 'lose' | 'tie', multiplier?: number) => void;
}

export const PokerGame: React.FC<PokerGameProps> = ({
  onResult,
  onExit,
  combatMode = false,
  onCombatResult,
}) => {
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [enemyHand, setEnemyHand] = useState<CardType[]>([]);
  const [phase, setPhase] = useState<'betting' | 'playing' | 'result'>('betting');
  const [result, setResult] = useState<'win' | 'lose' | 'tie' | null>(null);

  const dealCards = () => {
    const deck = shuffleDeck(createDeck());
    const { drawn: player, remaining } = drawCards(deck, 5);
    const { drawn: enemy } = drawCards(remaining, 5);

    setPlayerHand(player);
    setEnemyHand(enemy);
    setPhase('playing');
  };

  const playHand = () => {
    const playerEval = evaluateHand(playerHand);
    const enemyEval = evaluateHand(enemyHand);
    const winner = determineWinner(playerEval, enemyEval);

    const resultValue = winner === 'player' ? 'win' : winner === 'enemy' ? 'lose' : 'tie';
    setResult(resultValue);
    setPhase('result');

    // Call appropriate callback based on mode
    if (combatMode && onCombatResult) {
      onCombatResult(resultValue);
    } else {
      onResult(resultValue);
    }
  };

  return (
    <PixelCard className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-pixel text-casino-gold mb-2">
          {combatMode ? '⚔️ Poker Combat ⚔️' : '🃏 Poker Duel'}
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          {combatMode ? 'Win rounds to deal damage to the enemy!' : 'Highest hand value wins!'}
        </p>

        {/* How to Play */}
        <div className="bg-gray-900/50 rounded-lg p-4 text-left border border-purple-500/30">
          <h4 className="text-xs font-pixel text-casino-gold mb-2">📖 How to Play:</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• <strong>Deal Cards:</strong> Receive 5 cards</li>
            <li>• <strong>Play Hand:</strong> Compare with enemy</li>
            <li>• <strong>Win:</strong> Have better poker hand</li>
          </ul>
          <h4 className="text-xs font-pixel text-casino-gold mt-3 mb-2">🏆 Hand Rankings:</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>Royal Flush &gt; Straight Flush &gt; Four of a Kind</li>
            <li>Full House &gt; Flush &gt; Straight</li>
            <li>Three of a Kind &gt; Two Pair &gt; One Pair &gt; High Card</li>
          </ul>
        </div>
      </div>

      {/* Enemy Area */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h3 className="text-sm font-pixel mb-3 text-casino-gold">Enemy Hand</h3>
        <div className="flex gap-2 justify-center flex-wrap">
          {enemyHand.map((card, index) => (
            <PokerCard
              key={index}
              card={card}
              hidden={phase === 'betting' || phase === 'playing'}
            />
          ))}
        </div>
      </div>

      {/* Player Area */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h3 className="text-sm font-pixel mb-3 text-casino-gold">Your Hand</h3>
        <div className="flex gap-2 justify-center flex-wrap">
          {playerHand.map((card, index) => (
            <PokerCard key={index} card={card} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        {phase === 'betting' && (
          <PixelButton onClick={dealCards} variant="primary">
            Deal Cards
          </PixelButton>
        )}

        {phase === 'playing' && (
          <PixelButton onClick={playHand} variant="primary">
            Play Hand
          </PixelButton>
        )}

        <PixelButton onClick={onExit} variant="secondary">
          {phase === 'result' ? 'Close' : 'Fold'}
        </PixelButton>
      </div>

      {/* Result Display */}
      {phase === 'result' && result && (
        <div className="mt-6 text-center">
          <div className={`text-xl font-pixel ${
            result === 'win' ? 'text-pixel-green' : result === 'lose' ? 'text-pixel-red' : 'text-yellow-500'
          }`}>
            {result === 'win' ? '🎉 You Win!' : result === 'lose' ? '💀 You Lose' : '🤝 Tie'}
          </div>
        </div>
      )}
    </PixelCard>
  );
};
