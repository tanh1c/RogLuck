import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CoinParticleProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  amount: number;
  onComplete?: () => void;
}

export const CoinParticle: React.FC<CoinParticleProps> = ({
  startX,
  startY,
  endX,
  endY,
  amount,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed pointer-events-none z-50 text-2xl"
      style={{ left: startX, top: startY }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
      animate={
        isVisible
          ? {
              opacity: [1, 1, 0],
              x: endX - startX,
              y: endY - startY,
              scale: [0.5, 1.2, 0.8],
              rotate: [0, 180, 360],
            }
          : { opacity: 0 }
      }
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-1 text-yellow-500 font-pixel">
        <span>🪙</span>
        <span className="text-white">+{amount}</span>
      </div>
    </motion.div>
  );
};
