import React from 'react';
import { Heart, Coins, Trophy, Layers } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useDeckStore } from '../../store/deckStore';

export const SidebarHUD: React.FC = () => {
  const { playerHP, maxHP, gold, currentFloor, maxFloor } = useGameStore();
  const { deck } = useDeckStore();

  const hpPercentage = Math.min((playerHP / maxHP) * 100, 100);

  return (
    <div className="space-y-3 p-3 bg-gray-900/50 rounded-lg border border-purple-500/30">
      {/* HP Bar */}
      <div className="flex items-center gap-2">
        <Heart className="w-3 h-3 text-pixel-red flex-shrink-0" />
        <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-150"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums whitespace-nowrap">{playerHP}/{maxHP}</span>
      </div>

      {/* Gold */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-3 h-3 text-casino-gold flex-shrink-0" />
          <span className="text-xs text-gray-300">Gold</span>
        </div>
        <span className="text-sm font-bold text-casino-gold tabular-nums">{gold}</span>
      </div>

      {/* Floor */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-3 h-3 text-casino-gold flex-shrink-0" />
          <span className="text-xs text-gray-300">Floor</span>
        </div>
        <span className="text-sm font-bold text-white tabular-nums">{currentFloor}/{maxFloor}</span>
      </div>

      {/* Deck Size */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-3 h-3 text-blue-500 flex-shrink-0" />
          <span className="text-xs text-gray-300">Deck</span>
        </div>
        <span className="text-sm font-bold text-white tabular-nums">{deck?.length || 0}</span>
      </div>
    </div>
  );
};
