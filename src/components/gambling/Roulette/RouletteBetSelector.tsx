import React, { useState } from 'react';
import { RouletteBet, BetType, BetColor, EvenOdd, HighLow, getNumberColor } from '../../../utils/gambling-logic/roulette';
import { PixelButton } from '../../ui/PixelButton';
import { PixelCard } from '../../ui/PixelCard';

interface RouletteBetSelectorProps {
  selectedBets: RouletteBet[];
  onBetSelect: (bet: RouletteBet) => void;
  onClearBets: () => void;
  currentBalance: number;
}

// European roulette numbers arranged in table format (3 columns)
// 0 at top, then 1-36 in rows of 3
const NUMBER_ROWS = [
  [0],  // 0 stands alone
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
  [16, 17, 18],
  [19, 20, 21],
  [22, 23, 24],
  [25, 26, 27],
  [28, 29, 30],
  [31, 32, 33],
  [34, 35, 36],
];

const CHIP_VALUES = [1, 5, 10, 25, 50, 100];

export const RouletteBetSelector: React.FC<RouletteBetSelectorProps> = ({
  selectedBets,
  onBetSelect,
  onClearBets,
  currentBalance,
}) => {
  const [selectedChip, setSelectedChip] = useState<number>(10);

  const getNumberColorClass = (num: number): string => {
    const color = getNumberColor(num);
    if (color === 'green') return 'bg-green-600 hover:bg-green-500';
    if (color === 'red') return 'bg-red-600 hover:bg-red-500';
    return 'bg-gray-700 hover:bg-gray-600';
  };

  const getBetAmount = (type: BetType, value: number | BetColor | EvenOdd | HighLow): number => {
    return selectedBets
      .filter(bet => bet.type === type && bet.value === value)
      .reduce((sum, bet) => sum + bet.amount, 0);
  };

  const handleNumberClick = (num: number) => {
    const existingBet = selectedBets.find(b => b.type === 'number' && b.value === num);
    const additionalAmount = existingBet ? existingBet.amount + selectedChip : selectedChip;

    if (additionalAmount > currentBalance) return;

    onBetSelect({
      type: 'number',
      value: num,
      amount: additionalAmount,
    });
  };

  const handleColorClick = (color: BetColor) => {
    if (color === 'green') return; // Only 0 is green, handled by number bet

    const existingBet = selectedBets.find(b => b.type === 'color' && b.value === color);
    const additionalAmount = existingBet ? existingBet.amount + selectedChip : selectedChip;

    if (additionalAmount > currentBalance) return;

    onBetSelect({
      type: 'color',
      value: color,
      amount: additionalAmount,
    });
  };

  const handleEvenOddClick = (value: EvenOdd) => {
    const existingBet = selectedBets.find(b => b.type === 'even_odd' && b.value === value);
    const additionalAmount = existingBet ? existingBet.amount + selectedChip : selectedChip;

    if (additionalAmount > currentBalance) return;

    onBetSelect({
      type: 'even_odd',
      value,
      amount: additionalAmount,
    });
  };

  const handleHighLowClick = (value: HighLow) => {
    const existingBet = selectedBets.find(b => b.type === 'high_low' && b.value === value);
    const additionalAmount = existingBet ? existingBet.amount + selectedChip : selectedChip;

    if (additionalAmount > currentBalance) return;

    onBetSelect({
      type: 'high_low',
      value,
      amount: additionalAmount,
    });
  };

  const totalBets = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <PixelCard className="p-4 md:p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-pixel text-casino-gold mb-2">PLACE YOUR BETS</h3>
        <div className="text-xs font-pixel text-gray-400">
          Balance: <span className="text-yellow-400">{currentBalance}</span> gold |
          Total Bet: <span className="text-red-400">{totalBets}</span> gold
        </div>
      </div>

      {/* Chip Selector */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {CHIP_VALUES.map(value => (
          <button
            key={value}
            onClick={() => setSelectedChip(value)}
            className={`w-12 h-12 rounded-full font-pixel text-xs md:text-sm transition-all
              ${selectedChip === value
                ? 'bg-yellow-400 text-casino-dark scale-110 ring-2 ring-yellow-200'
                : 'bg-gray-700 text-white hover:bg-gray-600'
              }
              border-4 border-gray-800
            `}
            style={{
              boxShadow: selectedChip === value
                ? '0 4px 0 #a16207, 0 5px 10px rgba(0,0,0,0.3)'
                : '0 4px 0 #374151, 0 5px 10px rgba(0,0,0,0.3)'
            }}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Betting Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[300px]">
          {/* Numbers Grid */}
          <div className="mb-4 p-2 bg-gray-700 rounded-lg">
            {NUMBER_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 mb-1 justify-center">
                {row.map(num => {
                  const betAmount = getBetAmount('number', num);
                  return (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded font-pixel text-sm md:text-base text-white transition-all
                        ${getNumberColorClass(num)}
                        ${betAmount > 0 ? 'ring-2 ring-yellow-400' : ''}
                      `}
                      style={{
                        boxShadow: '0 2px 0 #00000050'
                      }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span>{num}</span>
                        {betAmount > 0 && (
                          <span className="text-xs text-yellow-300">+{betAmount}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Outside Bets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {/* Red/Black */}
            <button
              onClick={() => handleColorClick('red')}
              className={`py-3 px-4 rounded font-pixel text-sm text-white transition-all
                bg-red-600 hover:bg-red-500
                ${getBetAmount('color', 'red') > 0 ? 'ring-2 ring-yellow-400' : ''}
              `}
              style={{ boxShadow: '0 2px 0 #00000050' }}
            >
              <div>RED</div>
              {getBetAmount('color', 'red') > 0 && (
                <div className="text-xs text-yellow-300">+{getBetAmount('color', 'red')}</div>
              )}
            </button>
            <button
              onClick={() => handleColorClick('black')}
              className={`py-3 px-4 rounded font-pixel text-sm text-white transition-all
                bg-gray-800 hover:bg-gray-700
                ${getBetAmount('color', 'black') > 0 ? 'ring-2 ring-yellow-400' : ''}
              `}
              style={{ boxShadow: '0 2px 0 #00000050' }}
            >
              <div>BLACK</div>
              {getBetAmount('color', 'black') > 0 && (
                <div className="text-xs text-yellow-300">+{getBetAmount('color', 'black')}</div>
              )}
            </button>

            {/* Even/Odd */}
            <button
              onClick={() => handleEvenOddClick('even')}
              className={`py-3 px-4 rounded font-pixel text-sm text-white transition-all
                bg-gray-600 hover:bg-gray-500
                ${getBetAmount('even_odd', 'even') > 0 ? 'ring-2 ring-yellow-400' : ''}
              `}
              style={{ boxShadow: '0 2px 0 #00000050' }}
            >
              <div>EVEN</div>
              {getBetAmount('even_odd', 'even') > 0 && (
                <div className="text-xs text-yellow-300">+{getBetAmount('even_odd', 'even')}</div>
              )}
            </button>
            <button
              onClick={() => handleEvenOddClick('odd')}
              className={`py-3 px-4 rounded font-pixel text-sm text-white transition-all
                bg-gray-600 hover:bg-gray-500
                ${getBetAmount('even_odd', 'odd') > 0 ? 'ring-2 ring-yellow-400' : ''}
              `}
              style={{ boxShadow: '0 2px 0 #00000050' }}
            >
              <div>ODD</div>
              {getBetAmount('even_odd', 'odd') > 0 && (
                <div className="text-xs text-yellow-300">+{getBetAmount('even_odd', 'odd')}</div>
              )}
            </button>
          </div>

          {/* High/Low */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleHighLowClick('low')}
              className={`py-3 px-4 rounded font-pixel text-sm text-white transition-all
                bg-gray-600 hover:bg-gray-500
                ${getBetAmount('high_low', 'low') > 0 ? 'ring-2 ring-yellow-400' : ''}
              `}
              style={{ boxShadow: '0 2px 0 #00000050' }}
            >
              <div>LOW (1-18)</div>
              {getBetAmount('high_low', 'low') > 0 && (
                <div className="text-xs text-yellow-300">+{getBetAmount('high_low', 'low')}</div>
              )}
            </button>
            <button
              onClick={() => handleHighLowClick('high')}
              className={`py-3 px-4 rounded font-pixel text-sm text-white transition-all
                bg-gray-600 hover:bg-gray-500
                ${getBetAmount('high_low', 'high') > 0 ? 'ring-2 ring-yellow-400' : ''}
              `}
              style={{ boxShadow: '0 2px 0 #00000050' }}
            >
              <div>HIGH (19-36)</div>
              {getBetAmount('high_low', 'high') > 0 && (
                <div className="text-xs text-yellow-300">+{getBetAmount('high_low', 'high')}</div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Clear Bets Button */}
      {selectedBets.length > 0 && (
        <div className="text-center">
          <PixelButton onClick={onClearBets} variant="secondary">
            🗑️ Clear All Bets
          </PixelButton>
        </div>
      )}

      {/* Current Bets Summary */}
      {selectedBets.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <h4 className="text-xs font-pixel text-casino-gold mb-2">Current Bets:</h4>
          <div className="text-xs font-pixel text-gray-300 space-y-1 max-h-32 overflow-y-auto">
            {selectedBets.map((bet, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {bet.type === 'number' && `${bet.value}`}
                  {bet.type === 'color' && `${String(bet.value).toUpperCase()}`}
                  {bet.type === 'even_odd' && `${String(bet.value).toUpperCase()}`}
                  {bet.type === 'high_low' && `${String(bet.value).toUpperCase()}`}
                </span>
                <span className="text-yellow-400">{bet.amount}g</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PixelCard>
  );
};
