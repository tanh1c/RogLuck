import React from 'react';
import { useMetaStore } from '../../store/metaStore';
import { SidebarPanel } from '../layout/SidebarPanel';
import { Sword, Trophy, Flame, Target } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const { statistics } = useMetaStore();

  const stats = [
    {
      icon: <Target className="w-3 h-3" />,
      label: 'Kills',
      value: statistics.totalEnemiesDefeated || 0,
      color: 'text-red-500'
    },
    {
      icon: <Trophy className="w-3 h-3" />,
      label: 'Wins',
      value: statistics.runsWon || 0,
      color: 'text-casino-gold'
    },
    {
      icon: <Flame className="w-3 h-3" />,
      label: 'Streak',
      value: statistics.winStreak || 0,
      color: 'text-orange-500'
    },
    {
      icon: <Sword className="w-3 h-3" />,
      label: 'Best',
      value: statistics.bestWinStreak || 0,
      color: 'text-purple-500'
    },
  ];

  return (
    <SidebarPanel title="Quick Stats" icon="📊" collapsible>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800/50 rounded p-2 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <div className={`${stat.color} mb-1`}>{stat.icon}</div>
            <div className="text-center">
              <div className="text-xs text-gray-400">{stat.label}</div>
              <div className="text-sm font-bold text-white tabular-nums">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </SidebarPanel>
  );
};
