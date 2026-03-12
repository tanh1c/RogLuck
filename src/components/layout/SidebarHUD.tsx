import React from 'react';
import { Heart, Coins, Trophy, Layers } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useDeckStore } from '../../store/deckStore';

export const SidebarHUD: React.FC = () => {
  const { playerHP, maxHP, gold, currentFloor, maxFloor } = useGameStore();
  const { deck } = useDeckStore();

  const hpPercentage = Math.min((playerHP / maxHP) * 100, 100);
  const isLowHP = hpPercentage <= 25;

  return (
    <div className="space-y-3 p-3 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-purple-500/40 shadow-lg shadow-purple-900/20">
      {/* HP Bar */}
      <div className="flex items-center gap-2 group">
        <Heart
          className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
            isLowHP ? 'text-pixel-red animate-pulse' : 'text-red-500'
          }`}
          aria-hidden="true"
        />
        <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isLowHP
                ? 'bg-gradient-to-r from-red-700 via-red-600 to-red-500 animate-pulse'
                : 'bg-gradient-to-r from-red-600 to-red-400'
            }`}
            style={{ width: `${hpPercentage}%` }}
            role="progressbar"
            aria-valuenow={playerHP}
            aria-valuemin={0}
            aria-valuemax={maxHP}
            aria-label="Health points"
          />
        </div>
        <span className="text-xs font-bold tabular-nums min-w-[3rem] text-right">{playerHP}/{maxHP}</span>
      </div>

      {/* Gold */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-purple-900/20 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-casino-gold flex-shrink-0" aria-hidden="true" />
          <span className="text-xs text-gray-400 font-medium">Gold</span>
        </div>
        <span className="text-sm font-bold text-casino-gold tabular-nums">{gold}</span>
      </div>

      {/* Floor */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-purple-900/20 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-casino-gold flex-shrink-0" aria-hidden="true" />
          <span className="text-xs text-gray-400 font-medium">Floor</span>
        </div>
        <span className="text-sm font-bold text-white tabular-nums">{currentFloor}/{maxFloor}</span>
      </div>

      {/* Deck Size */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-purple-900/20 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
          <span className="text-xs text-gray-400 font-medium">Deck</span>
        </div>
        <span className="text-sm font-bold text-white tabular-nums">{deck?.length || 0}</span>
      </div>
    </div>
  );
};
