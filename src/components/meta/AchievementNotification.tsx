import React, { useEffect } from 'react';
import { PixelCard } from '../ui/PixelCard';
import { Trophy } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: {
    name: string;
    description: string;
    reward: number;
    icon: string;
  };
  onDismiss: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <PixelCard className="p-4 bg-casino-gold text-casino-dark border-4 border-black">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">{achievement.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-pixel">Achievement Unlocked!</span>
            </div>
            <div className="text-xs font-pixel">{achievement.name}</div>
            <div className="text-xs text-casino-dark/70 font-pixel">
              +{achievement.reward} Casino Coins
            </div>
          </div>
        </div>
      </PixelCard>
    </div>
  );
};
