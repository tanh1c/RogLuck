import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DamageNumberProps {
  value: number;
  x: number;
  y: number;
  type?: 'damage' | 'heal' | 'gold';
  onComplete?: () => void;
}

export const DamageNumber: React.FC<DamageNumberProps> = ({
  value,
  x,
  y,
  type = 'damage',
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 300);
    }, 800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const colors = {
    damage: 'text-red-500',
    heal: 'text-green-500',
    gold: 'text-yellow-500',
  };

  const icons = {
    damage: '💥',
    heal: '💚',
    gold: '💰',
  };

  return (
    <motion.div
      className={`fixed pointer-events-none z-50 ${colors[type]} font-pixel text-2xl`}
      style={{ left: x, top: y }}
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={isVisible ? { opacity: 1, y: -50, scale: 1.2 } : { opacity: 0, y: -80, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-1">
        <span>{icons[type]}</span>
        <span>{value}</span>
      </div>
    </motion.div>
  );
};
