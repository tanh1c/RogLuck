import React, { useState } from 'react';
import { CARD_DATABASE } from '../../types/cards';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';

interface CardRewardsProps {
  options: string[]; // Card IDs
  onSelect: (cardId: string) => void;
}

export const CardRewards: React.FC<CardRewardsProps> = ({ options, onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <PixelCard className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-pixel text-casino-gold text-center mb-6">
        Choose a Reward Card
      </h2>

      <div className="flex gap-4 justify-center flex-wrap mb-6">
        {options.map((cardId) => {
          const card = CARD_DATABASE[cardId];
          if (!card) return null;

          return (
            <div
              key={cardId}
              className={`
                cursor-pointer transition-transform
                ${selected === cardId ? 'scale-110 ring-4 ring-casino-gold' : 'hover:scale-105'}
              `}
              onClick={() => setSelected(cardId)}
            >
              <PixelCard
                className="w-32 h-40 p-3 flex flex-col items-center justify-center"
                variant={
                  card.type === 'technique' ? 'purple' :
                  card.type === 'ability' ? 'gold' : 'default'
                }
              >
                <div className="text-sm font-pixel text-casino-gold text-center mb-2">
                  {card.name}
                </div>
                <div className="text-2xl mb-2">
                  {card.type === 'technique' && '🎴'}
                  {card.type === 'ability' && '🔮'}
                  {card.type === 'modifier' && '🍀'}
                </div>
                <div className="text-xs text-gray-400 text-center">
                  {card.description}
                </div>
              </PixelCard>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <PixelButton
          onClick={handleSelect}
          variant="primary"
          disabled={!selected}
        >
          Select Card
        </PixelButton>
      </div>
    </PixelCard>
  );
};
