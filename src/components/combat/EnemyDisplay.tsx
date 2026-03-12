import React from 'react';
import { Enemy } from '../../types/game';
import { PixelCard } from '../ui/PixelCard';

interface EnemyDisplayProps {
  enemy: Enemy;
}

export const EnemyDisplay: React.FC<EnemyDisplayProps> = ({ enemy }) => {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;

  // Get enemy emoji based on class
  const getEnemyEmoji = (enemyClass: string) => {
    switch (enemyClass) {
      case 'warrior':
        return '🗡️';
      case 'mage':
        return '🔮';
      case 'archer':
        return '🏹';
      case 'rogue':
        return '🗡️';
      case 'boss':
        return '👹';
      default:
        return '👾';
    }
  };

  // Get HP bar color based on percentage
  const getHpBarColor = () => {
    if (hpPercentage > 60) return 'bg-green-500';
    if (hpPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <PixelCard className="p-4 md:p-6" variant="danger">
      <div className="flex flex-col items-center">
        {/* Enemy Sprite */}
        <div className="text-6xl md:text-8xl mb-4 animate-pulse">
          {getEnemyEmoji(enemy.class)}
        </div>

        {/* Enemy Name */}
        <h3 className="text-lg md:text-xl font-pixel text-red-400 mb-2">
          {enemy.name}
        </h3>

        {/* HP Bar Container */}
        <div className="w-full max-w-xs bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600">
          {/* HP Bar */}
          <div
            className={`h-4 md:h-6 ${getHpBarColor()} transition-all duration-300`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>

        {/* HP Text */}
        <p className="text-sm md:text-base font-pixel text-white mt-2">
          HP: {enemy.hp} / {enemy.maxHp}
        </p>
      </div>
    </PixelCard>
  );
};
