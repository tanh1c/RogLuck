import React from 'react';
import { SlotSymbol, SYMBOL_CHARS, getSymbolAtIndex } from '../../../utils/gambling-logic/slot';
import './Slot.css';

interface SlotReelProps {
  spinning: boolean;
  stopIndex: number; // The index at which the reel should stop
  delay?: number; // Delay before stopping (for sequential stop effect)
}

export const SlotReel: React.FC<SlotReelProps> = ({
  spinning,
  stopIndex,
  delay = 0,
}) => {
  // Generate symbols for the reel strip (repeating pattern)
  const reelSymbols: SlotSymbol[] = [];
  for (let i = 0; i < 21; i++) {
    reelSymbols.push(getSymbolAtIndex(i));
  }

  // Calculate the position to stop at the target symbol
  // We want the target symbol to be in the middle (position 7, 8, or 9 of the visible area)
  const baseStopPosition = stopIndex + 7;

  return (
    <div className="slot-reel-container">
      <div className="slot-reel-window">
        <div
          className={`slot-reel ${spinning ? 'spinning' : ''}`}
          style={{
            transform: spinning
              ? `translateY(0)`
              : `translateY(-${(baseStopPosition - 7) * 60}px)`,
            transitionDelay: `${delay}ms`,
          }}
        >
          {reelSymbols.map((symbol, index) => (
            <div key={index} className="slot-reel-symbol">
              <span className="symbol-char">{SYMBOL_CHARS[symbol]}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Win line indicator */}
      <div className="win-line"></div>
    </div>
  );
};
