import React, { useState, useCallback, useEffect } from 'react';
import {
  spin,
  SYMBOL_VALUES,
  SYMBOL_CHARS,
  SlotSymbol,
  ALL_SYMBOLS,
  getWinDescription,
} from '../../../utils/gambling-logic/slot';
import { SlotReel } from './SlotReel';
import { PixelButton } from '../../ui/PixelButton';
import { PixelCard } from '../../ui/PixelCard';

interface SlotMachineProps {
  onResult: (result: 'win' | 'lose', winnings?: number) => void;
  onExit: () => void;
  // Combat mode props
  combatMode?: boolean;
  onCombatResult?: (result: 'win' | 'lose', damage?: number) => void;
  // Starting balance for standalone mode
  initialBalance?: number;
  // Key prop to force reset when combat round changes
  roundKey?: number;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  onResult,
  onExit,
  combatMode = false,
  onCombatResult,
  initialBalance = 100,
  roundKey = 0,
}) => {
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState<number>(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<SlotSymbol[]>(['cherry', 'cherry', 'cherry']);
  const [lastWinnings, setLastWinnings] = useState(0);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [message, setMessage] = useState<string>('');
  const [hasCalledResult, setHasCalledResult] = useState(false);

  // Reset game when roundKey changes (parent signals new round)
  useEffect(() => {
    resetGame();
  }, [roundKey]);

  const resetGame = () => {
    setSpinning(false);
    setGameResult(null);
    setLastWinnings(0);
    setMessage('');
    setHasCalledResult(false);
  };

  const handleSpin = useCallback(() => {
    if (spinning) return;
    if (bet > balance) {
      setMessage('⚠️ Insufficient balance!');
      return;
    }
    if (bet <= 0) {
      setMessage('⚠️ Invalid bet amount!');
      return;
    }

    // Deduct bet from balance
    setBalance(prev => prev - bet);
    setSpinning(true);
    setGameResult(null);
    setLastWinnings(0);
    setMessage('');

    // Determine result beforehand
    const result = spin();

    // Delay for spinning animation
    setTimeout(() => {
      setSpinning(false);
      setReels(result.reels);

      const winnings = result.winnings * bet;
      setLastWinnings(winnings);

      if (winnings > 0) {
        setBalance(prev => prev + winnings);
        setMessage(`🎉 ${getWinDescription(result.reels)} Won ${winnings} gold!`);
        setGameResult('win');

        if (combatMode && onCombatResult && !hasCalledResult) {
          setHasCalledResult(true);
          const multiplier = winnings / bet;
          onCombatResult('win', multiplier);
        } else {
          onResult('win', winnings);
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
    }, 2000);
  }, [spinning, bet, balance, combatMode, onCombatResult, onResult]);

  return (
    <PixelCard className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-pixel text-casino-gold mb-2">
          {combatMode ? '⚔️ Slot Combat ⚔️' : '🎰 Slot Machine'}
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          {combatMode ? 'Win rounds to deal damage to the enemy!' : 'Spin and match symbols to win!'}
        </p>

        {/* How to Play */}
        <div className="bg-gray-900/50 rounded-lg p-4 text-left border border-purple-500/30">
          <h4 className="text-xs font-pixel text-casino-gold mb-2">📖 How to Play:</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• <strong>Select Bet:</strong> Choose 5g, 10g, 25g, 50g, or 100g</li>
            <li>• <strong>SPIN:</strong> Spin the 3 reels</li>
            <li>• <strong>Win:</strong> Match 2 or 3 symbols for prizes</li>
          </ul>
          <h4 className="text-xs font-pixel text-casino-gold mt-3 mb-2">💡 Payouts:</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• 2 matching symbols = ½ payout</li>
            <li>• 3 matching symbols = full payout (up to 10x!)</li>
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
        <div className="text-sm font-pixel">
          <span className="text-gray-400">Current Bet:</span>
          <span className="text-red-400 ml-2">{bet}</span>
          <span className="text-gray-500 ml-1">gold</span>
        </div>
      </div>

      {/* Slot Reels */}
      <div className="flex justify-center gap-4 mb-6 p-6 bg-gray-900 rounded-lg">
        {!spinning ? (
          // Show result symbols
          <>
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-2">{SYMBOL_CHARS[reels[0]]}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-2">{SYMBOL_CHARS[reels[1]]}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-2">{SYMBOL_CHARS[reels[2]]}</div>
            </div>
          </>
        ) : (
          // Show spinning animation with SlotReel components
          <>
            <SlotReel spinning={true} stopIndex={0} delay={0} />
            <SlotReel spinning={true} stopIndex={0} delay={200} />
            <SlotReel spinning={true} stopIndex={0} delay={400} />
          </>
        )}
      </div>

      {/* Result Display */}
      {!spinning && lastWinnings > 0 && (
        <div className="text-center mb-4">
          <div className="text-pixel-green font-pixel text-lg">
            💰 Won: {lastWinnings} gold!
          </div>
        </div>
      )}

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
        </div>
      )}

      {/* Bet Selector */}
      <div className="flex justify-center gap-2 mb-6">
        <span className="text-sm font-pixel text-gray-400 self-center">Bet:</span>
        {[5, 10, 25, 50, 100].map(amt => (
          <button
            key={amt}
            onClick={() => setBet(amt)}
            className={`px-4 py-2 text-xs font-pixel rounded ${
              bet === amt
                ? 'bg-yellow-500 text-casino-dark'
                : 'bg-gray-700 text-gray-300'
            }`}
            disabled={spinning}
          >
            {amt}g
          </button>
        ))}
      </div>

      {/* Controls - In combat mode, only show game action buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <PixelButton
          onClick={handleSpin}
          disabled={spinning || bet > balance}
          variant="primary"
          className="px-8 py-3"
        >
          {spinning ? '🎰 Spinning...' : '🎰 SPIN'}
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

      {/* Paytable */}
      <PixelCard className="p-4" variant="default">
        <h4 className="text-sm font-pixel text-casino-gold mb-3">📜 Paytable (3 matching)</h4>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-xs font-pixel text-gray-300">
          {ALL_SYMBOLS.map(symbol => (
            <div key={symbol} className="bg-gray-800 p-2 rounded text-center">
              <div className="text-lg mb-1">{SYMBOL_CHARS[symbol]}</div>
              <div className="text-yellow-400">{SYMBOL_VALUES[symbol]}x</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs font-pixel text-gray-400 text-center">
          2 matching = half payout | 3 matching = full payout
        </div>
      </PixelCard>
    </PixelCard>
  );
};
