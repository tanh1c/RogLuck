import React, { useState, useCallback, useEffect } from 'react';
import {
  rollDice,
  calculateWinnings,
  isValidBet,
  DiceBet,
  BetType,
  SumBet,
  OverUnder,
} from '../../../utils/gambling-logic/dice';
import { Dice } from './Dice';
import { PixelButton } from '../../ui/PixelButton';
import { PixelCard } from '../../ui/PixelCard';

interface DiceGameProps {
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

export const DiceGame: React.FC<DiceGameProps> = ({
  onResult,
  onExit,
  combatMode = false,
  onCombatResult,
  initialBalance = 100,
  roundKey = 0,
}) => {
  const [balance, setBalance] = useState(initialBalance);
  const [bets, setBets] = useState<DiceBet[]>([]);
  const [rolling, setRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<{ dice: number[]; total: number } | null>(null);
  const [lastWinnings, setLastWinnings] = useState(0);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [message, setMessage] = useState<string>('');
  const [hasCalledResult, setHasCalledResult] = useState(false);

  // Reset game when roundKey changes (parent signals new round)
  useEffect(() => {
    resetGame();
  }, [roundKey]);

  const resetGame = () => {
    setBets([]);
    setDiceResult(null);
    setLastWinnings(0);
    setGameResult(null);
    setMessage('');
    setHasCalledResult(false);
    setRolling(false);
  };

  // Current bet type selector
  const [selectedBetType, setSelectedBetType] = useState<BetType>('sum');
  const [selectedBetValue, setSelectedBetValue] = useState<string>('high');
  const [betAmount, setBetAmount] = useState<number>(10);

  const handleAddBet = useCallback(() => {
    let value: SumBet | number | OverUnder;

    switch (selectedBetType) {
      case 'sum':
      case 'over_under':
        value = selectedBetValue as SumBet | OverUnder;
        break;
      case 'specific_number':
      case 'exact_total':
        value = parseInt(selectedBetValue, 10);
        break;
      default:
        value = 'high';
    }

    const newBet: DiceBet = {
      type: selectedBetType,
      value,
      amount: betAmount,
    };

    if (!isValidBet(newBet)) {
      setMessage('⚠️ Invalid bet!');
      return;
    }

    if (betAmount > balance) {
      setMessage('⚠️ Insufficient balance!');
      return;
    }

    // Remove existing bet of same type and add new one
    setBets(prev => {
      const filtered = prev.filter(bet => bet.type !== selectedBetType);
      return [...filtered, newBet];
    });

    setMessage('');
  }, [selectedBetType, selectedBetValue, betAmount, balance]);

  const handleClearBets = useCallback(() => {
    setBets([]);
    setMessage('');
  }, []);

  const handleRoll = useCallback(() => {
    if (rolling) return;
    if (bets.length === 0) {
      setMessage('⚠️ Please place at least one bet!');
      return;
    }

    const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBet > balance) {
      setMessage('⚠️ Insufficient balance!');
      return;
    }

    // Deduct bets from balance
    setBalance(prev => prev - totalBet);
    setRolling(true);
    setDiceResult(null);
    setGameResult(null);
    setLastWinnings(0);
    setMessage('');

    // Roll dice with animation delay
    setTimeout(() => {
      const roll = rollDice(2);
      setDiceResult(roll);
      setRolling(false);

      // Calculate winnings
      const { totalWinnings } = calculateWinnings(roll, bets);
      setLastWinnings(totalWinnings);

      if (totalWinnings > 0) {
        setBalance(prev => prev + totalWinnings);
        setMessage(`🎉 You won ${totalWinnings} gold! Rolled: ${roll.dice.join(', ')} = ${roll.total}`);
        setGameResult('win');

        if (combatMode && onCombatResult && !hasCalledResult) {
          setHasCalledResult(true);
          const multiplier = totalWinnings / totalBet;
          onCombatResult('win', multiplier);
        } else {
          onResult('win', totalWinnings);
        }
      } else {
        setMessage(`💀 No luck this time! Rolled: ${roll.dice.join(', ')} = ${roll.total}`);
        setGameResult('lose');

        if (combatMode && onCombatResult && !hasCalledResult) {
          setHasCalledResult(true);
          onCombatResult('lose');
        } else {
          onResult('lose');
        }
      }

      // Clear bets after round
      setBets([]);
    }, 1500);
  }, [rolling, bets, balance, combatMode, onCombatResult, onResult]);

  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <PixelCard className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-pixel text-casino-gold mb-2">
          {combatMode ? '⚔️ Dice Combat ⚔️' : '🎲 Dice Game'}
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          {combatMode ? 'Win rounds to deal damage to the enemy!' : 'Roll the dice and win big!'}
        </p>

        {/* How to Play */}
        <div className="bg-gray-900/50 rounded-lg p-4 text-left border border-purple-500/30">
          <h4 className="text-xs font-pixel text-casino-gold mb-2">📖 How to Play:</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• <strong>Choose Bet Type:</strong> Sum, Over/Under, Specific Number, or Exact Total</li>
            <li>• <strong>Add Bet:</strong> Select amount and place your bet</li>
            <li>• <strong>ROLL:</strong> Roll 2 dice and match your bets</li>
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

      {/* Dice Display */}
      <div className="flex justify-center gap-8 mb-6 p-6 bg-gray-800 rounded-lg">
        {diceResult ? (
          <>
            <Dice value={diceResult.dice[0]} rolling={rolling} />
            <Dice value={diceResult.dice[1]} rolling={rolling} />
          </>
        ) : (
          <>
            <Dice value={1} rolling={rolling} />
            <Dice value={1} rolling={rolling} />
          </>
        )}
      </div>

      {/* Result Display */}
      {diceResult && (
        <div className="text-center mb-4">
          <div className="text-2xl font-pixel text-casino-gold">
            Total: {diceResult.total}
          </div>
          {lastWinnings > 0 && (
            <div className="text-pixel-green font-pixel text-lg mt-2">
              💰 Won: {lastWinnings} gold!
            </div>
          )}
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

      {/* Betting Area */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Bet Type Selector */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-pixel text-casino-gold mb-3">Bet Type</h3>

          <div className="space-y-3">
            {/* Sum Bet */}
            <div>
              <label className="text-xs font-pixel text-gray-300 block mb-1">
                Sum (High/Low)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedBetType('sum'); setSelectedBetValue('high'); }}
                  className={`flex-1 px-3 py-2 text-xs font-pixel rounded ${
                    selectedBetType === 'sum' && selectedBetValue === 'high'
                      ? 'bg-yellow-500 text-casino-dark'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  High (11-12)
                </button>
                <button
                  onClick={() => { setSelectedBetType('sum'); setSelectedBetValue('low'); }}
                  className={`flex-1 px-3 py-2 text-xs font-pixel rounded ${
                    selectedBetType === 'sum' && selectedBetValue === 'low'
                      ? 'bg-yellow-500 text-casino-dark'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Low (2-10)
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 font-pixel">Pays 1:1</div>
            </div>

            {/* Over/Under Bet */}
            <div>
              <label className="text-xs font-pixel text-gray-300 block mb-1">
                Over/Under 10.5
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedBetType('over_under'); setSelectedBetValue('over'); }}
                  className={`flex-1 px-3 py-2 text-xs font-pixel rounded ${
                    selectedBetType === 'over_under' && selectedBetValue === 'over'
                      ? 'bg-yellow-500 text-casino-dark'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Over (11-12)
                </button>
                <button
                  onClick={() => { setSelectedBetType('over_under'); setSelectedBetValue('under'); }}
                  className={`flex-1 px-3 py-2 text-xs font-pixel rounded ${
                    selectedBetType === 'over_under' && selectedBetValue === 'under'
                      ? 'bg-yellow-500 text-casino-dark'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Under (2-10)
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 font-pixel">Pays 1:1</div>
            </div>

            {/* Specific Number Bet */}
            <div>
              <label className="text-xs font-pixel text-gray-300 block mb-1">
                Specific Number (1-6)
              </label>
              <div className="grid grid-cols-6 gap-1">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => { setSelectedBetType('specific_number'); setSelectedBetValue(num.toString()); }}
                    className={`px-2 py-2 text-xs font-pixel rounded ${
                      selectedBetType === 'specific_number' && selectedBetValue === num.toString()
                        ? 'bg-yellow-500 text-casino-dark'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1 font-pixel">Pays 1:1 per match</div>
            </div>

            {/* Exact Total Bet */}
            <div>
              <label className="text-xs font-pixel text-gray-300 block mb-1">
                Exact Total (2-12)
              </label>
              <div className="grid grid-cols-6 gap-1">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <button
                    key={num}
                    onClick={() => { setSelectedBetType('exact_total'); setSelectedBetValue(num.toString()); }}
                    className={`px-2 py-2 text-xs font-pixel rounded ${
                      selectedBetType === 'exact_total' && selectedBetValue === num.toString()
                        ? 'bg-yellow-500 text-casino-dark'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1 font-pixel">Pays 2x-10x based on rarity</div>
            </div>
          </div>
        </div>

        {/* Bet Amount and Current Bets */}
        <div className="space-y-4">
          {/* Bet Amount Selector */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-pixel text-casino-gold mb-3">Bet Amount</h3>
            <div className="flex gap-2 mb-3">
              {[5, 10, 25, 50].map(amt => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className={`flex-1 px-3 py-2 text-xs font-pixel rounded ${
                    betAmount === amt
                      ? 'bg-yellow-500 text-casino-dark'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
            <PixelButton
              onClick={handleAddBet}
              variant="primary"
              className="w-full py-2 text-sm"
              disabled={betAmount > balance}
            >
              Add Bet ({betAmount}g)
            </PixelButton>
          </div>

          {/* Current Bets */}
          <div className="bg-gray-800 p-4 rounded-lg flex-1">
            <h3 className="text-sm font-pixel text-casino-gold mb-3">Current Bets</h3>
            {bets.length === 0 ? (
              <p className="text-xs text-gray-500 font-pixel">No bets placed</p>
            ) : (
              <ul className="space-y-2">
                {bets.map((bet, idx) => (
                  <li key={idx} className="text-xs font-pixel text-gray-300 flex justify-between">
                    <span>
                      {bet.type === 'sum' && `${bet.value === 'high' ? 'High' : 'Low'}`}
                      {bet.type === 'over_under' && `${bet.value === 'over' ? 'Over' : 'Under'}`}
                      {bet.type === 'specific_number' && `Number ${bet.value}`}
                      {bet.type === 'exact_total' && `Exact ${bet.value}`}
                    </span>
                    <span className="text-yellow-400">{bet.amount}g</span>
                  </li>
                ))}
              </ul>
            )}
            <PixelButton
              onClick={handleClearBets}
              variant="secondary"
              className="w-full mt-3 py-2 text-xs"
              disabled={bets.length === 0 || rolling}
            >
              Clear Bets
            </PixelButton>
          </div>
        </div>
      </div>

      {/* Controls - In combat mode, only show game action buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <PixelButton
          onClick={handleRoll}
          disabled={rolling || bets.length === 0}
          variant="primary"
          className="px-8 py-3"
        >
          {rolling ? '🎲 Rolling...' : '🎲 ROLL'}
        </PixelButton>

        {!combatMode && (
          <PixelButton
            onClick={onExit}
            disabled={rolling}
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
            <span className="text-yellow-400">High/Low:</span> 1:1
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-red-400">Over/Under:</span> 1:1
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-blue-400">Specific:</span> 1:1/die
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-green-400">Exact:</span> 2x-10x
          </div>
        </div>
      </PixelCard>
    </PixelCard>
  );
};
