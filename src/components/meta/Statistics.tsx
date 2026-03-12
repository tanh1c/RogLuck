import React from 'react';
import { useMetaStore } from '../../store/metaStore';
import { PixelCard } from '../ui/PixelCard';
import { BarChart3, X } from 'lucide-react';

interface StatisticsProps {
  onClose: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ onClose }) => {
  const { statistics } = useMetaStore();

  const winRate = statistics.runsPlayed > 0
    ? Math.round((statistics.runsWon / statistics.runsPlayed) * 100)
    : 0;

  const avgGoldPerRun = statistics.runsPlayed > 0
    ? Math.round(statistics.totalGoldEarned / statistics.runsPlayed)
    : 0;

  const statBoxes = [
    { label: 'Runs Played', value: statistics.runsPlayed, icon: '\uD83C\uDFAE' },
    { label: 'Runs Won', value: statistics.runsWon, icon: '\uD83C\uDFC6' },
    { label: 'Win Rate', value: `${winRate}%`, icon: '\uD83D\uDCCA' },
    { label: 'Total Gold', value: statistics.totalGoldEarned, icon: '\uD83D\uDCB0' },
    { label: 'Enemies Defeated', value: statistics.totalEnemiesDefeated, icon: '\u2694\uFE0F' },
    { label: 'Highest Floor', value: statistics.highestFloorReached, icon: '\uD83C\uDFDB\uFE0F' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <PixelCard className="my-8 max-w-4xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-casino-gold" />
            <h2 className="text-2xl font-pixel text-casino-gold">Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="Close statistics"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {statBoxes.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800 p-4 rounded-lg text-center border-2 border-gray-700"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-pixel text-casino-gold mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 font-pixel">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700">
          <h3 className="text-sm font-pixel text-casino-gold mb-3">
            \uD83D\uDCC8 Career Summary
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between items-center">
              <span>Runs Lost:</span>
              <span className="font-pixel text-casino-gold">{statistics.runsPlayed - statistics.runsWon}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg Gold per Run:</span>
              <span className="font-pixel text-casino-gold">{avgGoldPerRun}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Win Streak:</span>
              <span className="font-pixel text-casino-gold">{statistics.winStreak}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Best Win Streak:</span>
              <span className="font-pixel text-casino-gold">{statistics.bestWinStreak}</span>
            </div>
          </div>
        </div>
      </PixelCard>
    </div>
  );
};
