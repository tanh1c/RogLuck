import React, { useState } from 'react';
import { useMetaStore, ACHIEVEMENTS } from '../../store/metaStore';
import { PixelCard } from '../ui/PixelCard';
import { Trophy, X } from 'lucide-react';

interface AchievementsProps {
  onClose: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ onClose }) => {
  const { achievements, getAchievementProgress } = useMetaStore();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    const isUnlocked = achievements.includes(achievement.id);
    if (filter === 'unlocked' && !isUnlocked) return false;
    if (filter === 'locked' && isUnlocked) return false;
    return true;
  });

  const unlockedCount = ACHIEVEMENTS.filter((a) => achievements.includes(a.id)).length;
  const progress = (unlockedCount / ACHIEVEMENTS.length) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'progress':
        return 'bg-blue-900 text-blue-200';
      case 'combat':
        return 'bg-red-900 text-red-200';
      case 'gambling':
        return 'bg-green-900 text-green-200';
      case 'collection':
        return 'bg-purple-900 text-purple-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <PixelCard className="my-8 p-6 max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-casino-gold" />
            <h2 className="text-2xl font-pixel text-casino-gold">Achievements</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="Close achievements"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="font-pixel text-casino-gold">
              {unlockedCount}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-700">
            <div
              className="h-full bg-gradient-to-r from-casino-gold to-yellow-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {(['all', 'unlocked', 'locked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-pixel capitalize transition-colors ${
                filter === f
                  ? 'bg-casino-gold text-casino-dark'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = achievements.includes(achievement.id);
            const progressData = getAchievementProgress(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isUnlocked
                    ? 'border-casino-gold bg-casino-gold/10'
                    : 'border-gray-700 bg-gray-800 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">
                    {isUnlocked ? achievement.icon : '\uD83D\uDD12'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`text-sm font-pixel truncate ${
                          isUnlocked ? 'text-casino-gold' : 'text-gray-500'
                        }`}
                      >
                        {achievement.name}
                        {isUnlocked && ' \u2705'}
                      </h3>
                      <span className="text-xs text-casino-gold font-pixel flex-shrink-0 ml-2">
                        +{achievement.reward}\uD83E\uDE99
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-pixel ${getCategoryColor(
                          achievement.category
                        )}`}
                      >
                        {achievement.category}
                      </span>
                      {!isUnlocked && progressData.required > 0 && (
                        <span className="text-xs text-gray-500 font-pixel">
                          {progressData.current}/{progressData.required}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
};
