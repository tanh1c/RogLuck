import React, { useState } from 'react';
import {
  BlackjackCard,
  createDeck,
  shuffleDeck,
  calculateHand,
  isBust,
  isBlackjack,
  determineWinner,
} from '../../../utils/gambling-logic/blackjack';
import { BlackjackCard as CardComponent } from './BlackjackCard';
import { PixelButton } from '../../ui/PixelButton';
import { PixelCard } from '../../ui/PixelCard';

interface BlackjackGameProps {
  onResult: (result: 'win' | 'lose' | 'tie', multiplier?: number) => void;
  onExit: () => void;
  // Combat mode props
  combatMode?: boolean;
  onCombatResult?: (result: 'win' | 'lose' | 'tie', multiplier?: number) => void;
}

export const BlackjackGame: React.FC<BlackjackGameProps> = ({
  onResult,
  onExit,
  combatMode = false,
  onCombatResult,
}) => {
  const [deck, setDeck] = useState<BlackjackCard[]>([]);
  const [playerHand, setPlayerHand] = useState<BlackjackCard[]>([]);
  const [dealerHand, setDealerHand] = useState<BlackjackCard[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | 'tie' | null>(null);

  const dealInitialCards = () => {
    const newDeck = shuffleDeck(createDeck());
    const player = [newDeck[0], newDeck[2]];
    const dealer = [newDeck[1], newDeck[3]];

    setPlayerHand(player);
    setDealerHand(dealer);
    setDeck(newDeck.slice(4));
    setGameOver(false);
    setResult(null);

    if (isBlackjack(player)) {
      setGameOver(true);
      setResult('win');
      // Use combat callback if in combat mode, otherwise use regular callback
      if (combatMode && onCombatResult) {
        onCombatResult('win', 1.5);
      } else {
        onResult('win', 1.5);
      }
    }
  };

  const hit = () => {
    if (deck.length === 0 || gameOver) return;

    const newCard = deck[0];
    const newHand = [...playerHand, newCard];

    setPlayerHand(newHand);
    setDeck(deck.slice(1));

    if (isBust(newHand)) {
      setGameOver(true);
      setResult('lose');
      // Use combat callback if in combat mode, otherwise use regular callback
      if (combatMode && onCombatResult) {
        onCombatResult('lose');
      } else {
        onResult('lose');
      }
    }
  };

  const stand = () => {
    if (gameOver) return;

    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];

    while (calculateHand(newDealerHand) < 17 && newDeck.length > 0) {
      newDealerHand.push(newDeck[0]);
      newDeck = newDeck.slice(1);
    }

    setDealerHand(newDealerHand);
    setDeck(newDeck);
    setGameOver(true);

    const winner = determineWinner(playerHand, newDealerHand);
    const resultValue: 'win' | 'lose' | 'tie' = winner === 'player' ? 'win' : winner === 'dealer' ? 'lose' : 'tie';
    setResult(resultValue);

    // Use combat callback if in combat mode, otherwise use regular callback
    if (combatMode && onCombatResult) {
      onCombatResult(resultValue);
    } else {
      onResult(resultValue);
    }
  };

  const playerTotal = calculateHand(playerHand);
  const dealerTotal = gameOver ? calculateHand(dealerHand) : 0;

  return (
    <PixelCard className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-pixel text-casino-gold mb-2">
          {combatMode ? '⚔️ Blackjack Combat ⚔️' : '🎰 Blackjack'}
        </h2>
        <p className="text-gray-400 text-xs">
          {combatMode ? 'Win rounds to deal damage to the enemy!' : 'Beat the dealer without going over 21!'}
        </p>
      </div>

      {/* Dealer Area */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h3 className="text-sm font-pixel mb-3 text-casino-gold">
          Dealer {gameOver && `(${dealerTotal})`}
        </h3>
        <div className="flex gap-2 justify-center flex-wrap">
          {dealerHand.map((card, index) => (
            <CardComponent key={index} card={card} />
          ))}
        </div>
      </div>

      {/* Player Area */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h3 className="text-sm font-pixel mb-3 text-casino-gold">
          You ({playerTotal})
        </h3>
        <div className="flex gap-2 justify-center flex-wrap">
          {playerHand.map((card, index) => (
            <CardComponent key={index} card={card} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        {playerHand.length === 0 ? (
          <PixelButton onClick={dealInitialCards} variant="primary">
            Deal
          </PixelButton>
        ) : !gameOver ? (
          <>
            <PixelButton onClick={hit} variant="primary">
              Hit
            </PixelButton>
            <PixelButton onClick={stand} variant="danger">
              Stand
            </PixelButton>
          </>
        ) : (
          <>
            <PixelButton onClick={dealInitialCards} variant="primary">
              New Game
            </PixelButton>
            <PixelButton onClick={onExit} variant="secondary">
              Exit
            </PixelButton>
          </>
        )}
      </div>

      {/* Result Display */}
      {gameOver && result && (
        <div className="mt-6 text-center">
          <div className={`text-xl font-pixel ${
            result === 'win' ? 'text-pixel-green' : result === 'lose' ? 'text-pixel-red' : 'text-yellow-500'
          }`}>
            {result === 'win' ? '🎉 You Win!' : result === 'lose' ? '💀 You Lose' : '🤝 Push'}
          </div>
        </div>
      )}
    </PixelCard>
  );
};
