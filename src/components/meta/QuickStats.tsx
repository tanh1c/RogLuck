import React from 'react';
import { useMetaStore } from '../../store/metaStore';
import { SidebarPanel } from '../layout/SidebarPanel';
import { Sword, Trophy, Flame, Target, BarChart3 } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const { statistics } = useMetaStore();

  const stats = [
    {
      icon: Target,
      label: 'Kills',
      value: statistics.totalEnemiesDefeated || 0,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      hoverBg: 'hover:bg-red-900/30'
    },
    {
      icon: Trophy,
      label: 'Wins',
      value: statistics.runsWon || 0,
      color: 'text-casino-gold',
      bgColor: 'bg-yellow-900/20',
      hoverBg: 'hover:bg-yellow-900/30'
    },
    {
      icon: Flame,
      label: 'Streak',
      value: statistics.winStreak || 0,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      hoverBg: 'hover:bg-orange-900/30'
    },
    {
      icon: Sword,
      label: 'Best',
      value: statistics.bestWinStreak || 0,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      hoverBg: 'hover:bg-purple-900/30'
    },
  ];

  return (
    <SidebarPanel title="Quick Stats" icon={BarChart3} collapsible>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} ${stat.hoverBg} rounded-lg p-2.5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 border border-transparent hover:border-purple-500/30`}
          >
            <stat.icon className={`w-4 h-4 ${stat.color} mb-1.5`} aria-hidden="true" />
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-0.5">{stat.label}</div>
              <div className="text-base font-bold text-white tabular-nums">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </SidebarPanel>
  );
};
