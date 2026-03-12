import React from 'react';
import { Card } from '../../types/cards';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';

interface CardUnlockModalProps {
  card: Card;
  onCollect: () => void;
  onClose: () => void;
}

export const CardUnlockModal: React.FC<CardUnlockModalProps> = ({
  card,
  onCollect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <PixelCard className="max-w-md p-6 text-center">
        <div className="text-4xl mb-4">🎉</div>

        <h2 className="text-xl font-pixel text-casino-gold mb-2">
          New Card Unlocked!
        </h2>

        <div className="my-6">
          <PixelCard
            className="inline-block p-4"
            variant={card.type === 'technique' ? 'purple' : card.type === 'ability' ? 'gold' : 'default'}
          >
            <div className="text-lg font-pixel text-casino-gold">{card.name}</div>
            <div className="text-xs text-gray-400 mt-1">{card.type}</div>
            <div className="text-sm mt-2">{card.description}</div>
          </PixelCard>
        </div>

        <div className="flex gap-4 justify-center">
          <PixelButton onClick={onCollect} variant="primary">
            Collect
          </PixelButton>
          <PixelButton onClick={onClose} variant="secondary">
            Later
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};
