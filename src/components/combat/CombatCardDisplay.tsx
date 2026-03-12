import React from 'react';
import { Card } from '../../types/cards';
import { PixelCard } from '../ui/PixelCard';

interface CombatCardDisplayProps {
  card: Card;
  isActive: boolean;
  onClick?: () => void;
}

// Get emoji based on effect type
function getEffectEmoji(effectType: string): string {
  switch (effectType) {
    case 'damage':
      return '⚔️';
    case 'heal':
      return '💚';
    case 'buff_win_rate':
      return '📈';
    case 'extra_damage':
      return '💥';
    case 'shield':
      return '🛡️';
    case 'steal_gold':
      return '💰';
    case 'crit_boost':
      return '⭐';
    default:
      return '🎯';
  }
}

// Get color class based on card type
function getTypeColorClass(type: string): string {
  switch (type) {
    case 'technique':
      return 'bg-purple-900 text-purple-200 border-purple-700';
    case 'ability':
      return 'bg-yellow-900 text-yellow-200 border-yellow-700';
    case 'modifier':
      return 'bg-green-900 text-green-200 border-green-700';
    default:
      return 'bg-gray-800 text-gray-200 border-gray-600';
  }
}

// Get trigger badge text
function getTriggerText(trigger: string): string {
  switch (trigger) {
    case 'on_play':
      return 'On Play';
    case 'on_win':
      return 'On Win';
    case 'on_loss':
      return 'On Loss';
    case 'passive':
      return 'Passive';
    default:
      return trigger;
  }
}

export const CombatCardDisplay: React.FC<CombatCardDisplayProps> = ({
  card,
  isActive,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        transition-all duration-200
      `}
      onClick={handleClick}
    >
      <PixelCard
        className={`
          p-4
          ${isActive ? 'ring-4 ring-casino-gold scale-105' : ''}
        `}
        variant={
          card.type === 'technique' ? 'purple' :
          card.type === 'ability' ? 'gold' : 'default'
        }
      >
        {/* Header: Name and Level */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-pixel text-casino-gold">{card.name}</h3>
          <span className="text-xs text-gray-400 font-pixel">Lv.{card.level}</span>
        </div>

        {/* Card Type Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`
            px-2 py-1 rounded text-xs font-pixel border
            ${getTypeColorClass(card.type)}
          `}>
            {card.type.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 font-pixel">
            {card.rarity.toUpperCase()}
          </span>
        </div>

        {/* Card Description */}
        <p className="text-xs text-gray-300 mb-3 font-pixel leading-tight">
          {card.description}
        </p>

        {/* Effect Display */}
        <div className="bg-gray-900 rounded p-2 mb-2 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getEffectEmoji(card.effect.type)}</span>
            <span className={`text-xs font-pixel ${getEffectTextColor(card.effect.type)}`}>
              {card.effect.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white font-pixel">
              Value: {card.effect.value}
            </span>
            <span className="text-xs text-gray-400 font-pixel">
              {getTriggerText(card.effect.trigger)}
            </span>
          </div>
          {card.effect.duration && (
            <div className="text-xs text-cyan-400 font-pixel mt-1">
              Duration: {card.effect.duration} turns
            </div>
          )}
        </div>

        {/* Active Status Indicator */}
        {isActive && (
          <div className="text-center text-xs font-pixel text-green-400 animate-pulse">
            ✨ ACTIVE ✨
          </div>
        )}
      </PixelCard>
    </div>
  );
};

// Helper function for effect text color
function getEffectTextColor(effectType: string): string {
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
