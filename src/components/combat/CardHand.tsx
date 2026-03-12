import React from 'react';
import { Card } from '../../types/cards';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';

interface CardHandProps {
  cards: Card[];
  onPlayCard: (card: Card) => void;
  disabled: boolean;
  playerTurn: boolean;
  selectedCardId?: string | null;
}

// Helper function to get card variant based on type
function getCardVariant(card: Card): 'default' | 'gold' | 'purple' | 'danger' {
  switch (card.type) {
    case 'technique':
      return 'purple';
    case 'ability':
      return 'gold';
    case 'modifier':
      return 'default';
    default:
      return 'default';
  }
}

// Helper function to get card emoji based on type and effect
function getCardEmoji(card: Card): string {
  // First check by effect type
  switch (card.effect.type) {
    case 'damage':
      return '⚔️';
    case 'heal':
      return '💚';
    case 'buff_win_rate':
      return '🍀';
    case 'extra_damage':
      return '🔥';
    case 'shield':
      return '🛡️';
    case 'steal_gold':
      return '💰';
    case 'crit_boost':
      return '💎';
  }

  // Fallback to type-based emoji
  switch (card.type) {
    case 'technique':
      return '🎴';
    case 'ability':
      return '🔮';
    case 'modifier':
      return '🍀';
    default:
      return '🃏';
  }
}

// Helper to get effect color
function getEffectColor(effectType: string): string {
  switch (effectType) {
    case 'damage':
      return 'text-red-400';
    case 'heal':
      return 'text-green-400';
    case 'buff_win_rate':
      return 'text-blue-400';
    case 'extra_damage':
      return 'text-orange-400';
    case 'shield':
      return 'text-cyan-400';
    case 'steal_gold':
      return 'text-yellow-400';
    case 'crit_boost':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
}

export const CardHand: React.FC<CardHandProps> = ({
  cards,
  onPlayCard,
  disabled,
  playerTurn,
  selectedCardId,
}) => {
  if (cards.length === 0) {
    return (
      <PixelCard className="p-6" variant="default">
        <p className="text-center font-pixel text-gray-400">No cards in hand - drawing...</p>
      </PixelCard>
    );
  }

  return (
    <div className="w-full">
      <h4 className="text-sm font-pixel text-casino-gold mb-2 text-center">
        Your Hand ({cards.length} cards)
      </h4>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {cards.map((card) => (
          <PixelCard
            key={card.id}
            className={`
              p-3 md:p-4 cursor-pointer
              transition-all duration-100
              ${!disabled && playerTurn ? 'hover:scale-105 hover:-translate-y-2' : ''}
              ${disabled || !playerTurn ? 'opacity-60' : ''}
              ${selectedCardId === card.id ? 'ring-4 ring-casino-gold scale-105' : ''}
            `}
            variant={getCardVariant(card)}
          >
            <div
              onClick={() => !disabled && playerTurn && onPlayCard(card)}
              className="flex flex-col items-center min-w-[100px] md:min-w-[120px]"
            >
              {/* Card Emoji */}
              <span className="text-2xl md:text-3xl mb-2">
                {getCardEmoji(card)}
              </span>

              {/* Card Name */}
              <p className="text-xs md:text-sm font-pixel text-white text-center mb-1">
                {card.name}
              </p>

              {/* Card Level */}
              <p className="text-xs text-casino-gold font-pixel mb-1">
                Lv.{card.level}
              </p>

              {/* Card Type */}
              <p className="text-xs text-gray-400 capitalize mb-1">
                {card.type}
              </p>

              {/* Effect Display */}
              <div className={`text-xs font-pixel ${getEffectColor(card.effect.type)} mb-1`}>
                {card.effect.type.replace('_', ' ')}: {card.effect.value}
              </div>

              {/* Card Description */}
              <p className="text-xs text-gray-300 text-center leading-tight mb-2">
                {card.description}
              </p>

              {/* Play Button */}
              {!disabled && playerTurn && (
                <PixelButton
                  onClick={() => onPlayCard(card)}
                  variant="primary"
                  className="btn-pixel text-xs py-1 px-3 mt-2"
                >
                  Play
                </PixelButton>
              )}
            </div>
          </PixelCard>
        ))}
      </div>
    </div>
  );
};
