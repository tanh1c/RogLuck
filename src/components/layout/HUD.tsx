import React from 'react';
import { Heart, Coins, Trophy, Layers } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const HUD: React.FC = () => {
  const { playerHP, maxHP, gold, currentFloor, maxFloor } = useGameStore();

  const hpPercentage = (playerHP / maxHP) * 100;

  return (
    <header className="bg-casino-purple/20 border-b border-casino-purple/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* HP Bar */}
          <div className="flex items-center gap-2 min-w-[180px]">
            <Heart className="w-5 h-5 text-pixel-red" />
            <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-300"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium">{playerHP}/{maxHP}</span>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-casino-gold" />
            <span className="font-medium">{gold}</span>
          </div>

          {/* Floor */}
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-casino-gold" />
            <span className="font-medium">Floor {currentFloor}/{maxFloor}</span>
          </div>

          {/* Deck Size */}
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Deck: 0</span>
          </div>
        </div>
      </div>
    </header>
  );
};
