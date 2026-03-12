import React from 'react';
import { BlackjackCard as CardType } from '../../../utils/gambling-logic/blackjack';

interface BlackjackCardProps {
  card: CardType;
}

export const BlackjackCard: React.FC<BlackjackCardProps> = ({ card }) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center text-casino-dark">
      <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.rank}
      </span>
      <span className={`text-2xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.suit === 'hearts' && '♥'}
        {card.suit === 'diamonds' && '♦'}
        {card.suit === 'clubs' && '♣'}
        {card.suit === 'spades' && '♠'}
      </span>
    </div>
  );
};
