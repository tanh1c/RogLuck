import React from 'react';
import { motion } from 'framer-motion';
import { PokerCard as CardType } from '../../../utils/gambling-logic/poker';

interface PokerCardProps {
  card: CardType;
  hidden?: boolean;
  isRevealing?: boolean;
}

export const PokerCard: React.FC<PokerCardProps> = ({ card, hidden = false, isRevealing = false }) => {
  if (hidden) {
    return (
      <motion.div
        className="w-16 h-24 bg-casino-purple rounded-lg border-2 border-casino-gold flex items-center justify-center"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isRevealing ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-12 h-20 bg-casino-purple/50 rounded" />
      </motion.div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <motion.div
      className="w-16 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center text-casino-dark"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.rank}
      </span>
      <span className={`text-2xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.suit === 'hearts' && '♥'}
        {card.suit === 'diamonds' && '♦'}
        {card.suit === 'clubs' && '♣'}
        {card.suit === 'spades' && '♠'}
      </span>
    </motion.div>
  );
};
