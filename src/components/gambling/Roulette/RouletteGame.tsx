import React, { useState, useCallback, useEffect } from 'react';
import {
  RouletteBet,
  spin,
  calculateWinnings,
  isValidBet,
} from '../../../utils/gambling-logic/roulette';
import { RouletteWheel } from './RouletteWheel';
import { RouletteBetSelector } from './RouletteBetSelector';
import { PixelButton } from '../../ui/PixelButton';
import { PixelCard } from '../../ui/PixelCard';

interface RouletteGameProps {
  onResult: (result: 'win' | 'lose' | 'tie', winnings?: number) => void;
  onExit: () => void;
  // Combat mode props
  combatMode?: boolean;
  onCombatResult?: (result: 'win' | 'lose' | 'tie', damage?: number) => void;
  // Starting balance for standalone mode
  initialBalance?: number;
  // Key prop to force reset when combat round changes
  roundKey?: number;
}

export const RouletteGame: React.FC<RouletteGameProps> = ({
  onResult,
  onExit,
  combatMode = false,
  onCombatResult,
  initialBalance = 100,
  roundKey = 0,
}) => {
  const [balance, setBalance] = useState(initialBalance);
  const [selectedBets, setSelectedBets] = useState<RouletteBet[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [lastWinnings, setLastWinnings] = useState(0);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'tie' | null>(null);
  const [message, setMessage] = useState<string>('');
  const [hasCalledResult, setHasCalledResult] = useState(false);

  // Reset game when roundKey changes (parent signals new round)
  useEffect(() => {
    resetGame();
  }, [roundKey]);

  const resetGame = () => {
    setSelectedBets([]);
    setResult(null);
    setLastWinnings(0);
    setGameResult(null);
    setMessage('');
    setHasCalledResult(false);
    setSpinning(false);
  };

  const handleBetSelect = useCallback((newBet: RouletteBet) => {
    if (!isValidBet(newBet)) return;

    setSelectedBets(prevBets => {
      // Remove existing bet of same type and value
      const filteredBets = prevBets.filter(
        bet => !(bet.type === newBet.type && bet.value === newBet.value)
      );
      // Add new bet if amount > 0
      if (newBet.amount > 0) {
        return [...filteredBets, newBet];
      }
      return filteredBets;
    });
  }, []);

  const handleClearBets = useCallback(() => {
    setSelectedBets([]);
  }, []);

  const handleSpin = useCallback(() => {
    if (spinning) return;
    if (selectedBets.length === 0) {
      setMessage('⚠️ Please place at least one bet!');
      return;
    }

    const totalBet = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBet > balance) {
      setMessage('⚠️ Insufficient balance!');
      return;
    }

    // Deduct bets from balance
    setBalance(prev => prev - totalBet);
    setSpinning(true);
    setResult(null);
    setGameResult(null);
    setLastWinnings(0);
    setMessage('');

    // Spin the wheel
    const spinResult = spin();

    // Delay for animation
    setTimeout(() => {
      setSpinning(false);
      setResult(spinResult);

      // Calculate winnings
      const { totalWinnings } = calculateWinnings(spinResult, selectedBets);
      setLastWinnings(totalWinnings);

      if (totalWinnings > 0) {
        setBalance(prev => prev + totalWinnings);
        setMessage(`🎉 You won ${totalWinnings} gold!`);
        setGameResult('win');

        // Determine result type for combat
        if (combatMode && onCombatResult && !hasCalledResult) {
          setHasCalledResult(true);
          // Calculate damage multiplier based on win amount
          const totalBet = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
          const multiplier = totalWinnings / totalBet;
          onCombatResult('win', multiplier);
        } else {
          onResult('win', totalWinnings);
        }
      } else {
        setMessage('💀 No luck this time!');
        setGameResult('lose');

        if (combatMode && onCombatResult && !hasCalledResult) {
          setHasCalledResult(true);
          onCombatResult('lose');
        } else {
          onResult('lose');
        }
      }

      // Clear bets after round
      setSelectedBets([]);
    }, 3000);
  }, [spinning, selectedBets, balance, combatMode, onCombatResult, onResult]);

  const totalBet = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <PixelCard className="p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-pixel text-casino-gold mb-2">
            {combatMode ? '⚔️ Roulette Combat ⚔️' : '🎰 Roulette'}
          </h2>
          <p className="text-gray-400 text-xs mb-4">
            {combatMode
              ? 'Win rounds to deal damage to the enemy!'
              : 'Place your bets and spin the wheel!'}
          </p>

          {/* How to Play */}
          <div className="bg-gray-900/50 rounded-lg p-4 text-left border border-purple-500/30">
            <h4 className="text-xs font-pixel text-casino-gold mb-2">📖 How to Play:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <strong>Place Bets:</strong> Choose number, color, or type</li>
              <li>• <strong>SPIN:</strong> Wheel spins and lands on a number</li>
              <li>• <strong>Win:</strong> Match your bet to the result</li>
            </ul>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="text-sm font-pixel">
            <span className="text-gray-400">Balance:</span>
            <span className="text-yellow-400 ml-2">{balance}</span>
            <span className="text-gray-500 ml-1">gold</span>
          </div>
          {totalBet > 0 && (
            <div className="text-sm font-pixel">
              <span className="text-gray-400">Current Bet:</span>
              <span className="text-red-400 ml-2">{totalBet}</span>
              <span className="text-gray-500 ml-1">gold</span>
            </div>
          )}
        </div>

        {/* Game Area */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Wheel */}
          <div className="flex flex-col items-center justify-center">
            <RouletteWheel spinning={spinning} result={result} />
          </div>

          {/* Betting Area */}
          <div>
            <RouletteBetSelector
              selectedBets={selectedBets}
              onBetSelect={handleBetSelect}
              onClearBets={handleClearBets}
              currentBalance={balance}
            />
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`text-center mb-4 p-3 rounded-lg ${
            gameResult === 'win'
              ? 'bg-green-900/50 border-2 border-green-500'
              : gameResult === 'lose'
              ? 'bg-red-900/50 border-2 border-red-500'
              : 'bg-gray-800 border-2 border-gray-600'
          }`}>
            <div className={`font-pixel ${
              gameResult === 'win' ? 'text-pixel-green' : 'text-pixel-red'
            }`}>
              {message}
            </div>
            {lastWinnings > 0 && (
              <div className="text-yellow-400 font-pixel text-sm mt-1">
                💰 Total Winnings: {lastWinnings} gold
              </div>
            )}
          </div>
        )}

        {/* Controls - In combat mode, only show game action buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <PixelButton
            onClick={handleSpin}
            disabled={spinning || selectedBets.length === 0}
            variant="primary"
            className="px-8 py-3"
          >
            {spinning ? '🎲 Spinning...' : '🎰 SPIN'}
          </PixelButton>

          <PixelButton
            onClick={handleClearBets}
            disabled={spinning || selectedBets.length === 0}
            variant="secondary"
          >
            🗑️ Clear
          </PixelButton>

          {!combatMode && (
            <PixelButton
              onClick={onExit}
              disabled={spinning}
              variant="danger"
            >
              {gameResult ? 'Close' : 'Exit'}
            </PixelButton>
          )}

          {combatMode && gameResult && (
            <PixelButton
              onClick={resetGame}
              variant="primary"
            >
              Next Round
            </PixelButton>
          )}
        </div>

        {/* Payout Info */}
        <PixelCard className="mt-6 p-4" variant="default">
          <h4 className="text-sm font-pixel text-casino-gold mb-2">📜 Payouts</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-pixel text-gray-300">
            <div className="bg-gray-800 p-2 rounded">
              <span className="text-yellow-400">Number:</span> 35:1
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <span className="text-red-400">Red/Black:</span> 1:1
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <span className="text-blue-400">Even/Odd:</span> 1:1
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <span className="text-green-400">High/Low:</span> 1:1
            </div>
          </div>
        </PixelCard>
      </PixelCard>
    </div>
  );
};
