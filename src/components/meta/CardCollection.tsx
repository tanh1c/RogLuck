import React, { useState } from 'react';
import { useMetaStore } from '../../store/metaStore';
import { CARD_DATABASE } from '../../types/cards';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';

interface CardCollectionProps {
  onClose: () => void;
}

export const CardCollection: React.FC<CardCollectionProps> = ({ onClose }) => {
  const { cardCollection, unlockedCards } = useMetaStore();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'technique' | 'ability' | 'modifier'>('all');

  const cards = Object.entries(CARD_DATABASE);

  const filteredCards = cards.filter(([id, card]) => {
    const isUnlocked = unlockedCards.includes(id);

    if (filter === 'locked' && isUnlocked) return false;
    if (filter === 'unlocked' && !isUnlocked) return false;

    if (typeFilter !== 'all' && card.type !== typeFilter) return false;

    return true;
  });

  const rarityColors = {
    common: 'border-gray-400',
    uncommon: 'border-green-400',
    rare: 'border-blue-400',
    legendary: 'border-yellow-400',
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <PixelCard className="max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-pixel text-casino-gold">🃏 Card Collection</h2>
          <PixelButton onClick={onClose} variant="secondary">
            Close
          </PixelButton>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-pixel ${filter === 'all' ? 'bg-casino-gold text-casino-dark' : 'bg-gray-700 text-white'}`}
            >
              All ({cards.length})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-4 py-2 text-xs font-pixel ${filter === 'unlocked' ? 'bg-casino-gold text-casino-dark' : 'bg-gray-700 text-white'}`}
            >
              Unlocked ({unlockedCards.length})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-4 py-2 text-xs font-pixel ${filter === 'locked' ? 'bg-casino-gold text-casino-dark' : 'bg-gray-700 text-white'}`}
            >
              Locked ({cards.length - unlockedCards.length})
            </button>
          </div>

          <div className="flex gap-2">
            {(['all', 'technique', 'ability', 'modifier'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 text-xs font-pixel capitalize ${typeFilter === type ? 'bg-casino-gold text-casino-dark' : 'bg-gray-700 text-white'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCards.map(([id, card]) => {
            const isUnlocked = unlockedCards.includes(id);
            const stats = cardCollection?.timesUsed?.[id] || 0;
            const wins = cardCollection?.timesWon?.[id] || 0;

            return (
              <div
                key={id}
                className={`
                  relative p-4 rounded-lg border-2
                  ${rarityColors[card.rarity]}
                  ${isUnlocked ? 'bg-gray-800' : 'bg-gray-900 opacity-50'}
                `}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">🔒</span>
                  </div>
                )}

                <div className={isUnlocked ? '' : 'blur-sm'}>
                  <h3 className="text-sm font-pixel text-casino-gold mb-1">
                    {card.name}
                  </h3>

                  <div className="text-xs text-gray-400 mb-2">
                    {card.type}
                  </div>

                  <p className="text-xs text-gray-300 mb-3">
                    {card.description}
                  </p>

                  {isUnlocked && (
                    <div className="text-xs text-gray-500">
                      <div>Used: {stats} times</div>
                      <div>Wins: {wins}</div>
                      <div>Win rate: {stats > 0 ? Math.round((wins / stats) * 100) : 0}%</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-pixel text-casino-gold">{unlockedCards.length}</div>
              <div className="text-xs text-gray-400">Cards Unlocked</div>
            </div>
            <div>
              <div className="text-2xl font-pixel text-casino-gold">{cards.length - unlockedCards.length}</div>
              <div className="text-xs text-gray-400">Cards Locked</div>
            </div>
            <div>
              <div className="text-2xl font-pixel text-casino-gold">{cards.length}</div>
              <div className="text-xs text-gray-400">Total Cards</div>
            </div>
          </div>
        </div>
      </PixelCard>
    </div>
  );
};
