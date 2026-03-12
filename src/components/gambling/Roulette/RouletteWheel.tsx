import React, { useEffect, useState } from 'react';
import { getNumberColor } from '../../../utils/gambling-logic/roulette';
import { PixelCard } from '../../ui/PixelCard';

interface RouletteWheelProps {
  spinning: boolean;
  result: number | null;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ spinning, result }) => {
  const [rotation, setRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);

  // European roulette wheel numbers in order (clockwise from 0)
  const wheelNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

  useEffect(() => {
    if (spinning) {
      // Animate wheel spinning
      const wheelInterval = setInterval(() => {
        setRotation(prev => prev + 10);
      }, 50);

      // Ball spins opposite direction
      const ballInterval = setInterval(() => {
        setBallRotation(prev => prev - 15);
      }, 50);

      return () => {
        clearInterval(wheelInterval);
        clearInterval(ballInterval);
      };
    }
  }, [spinning]);

  useEffect(() => {
    if (!spinning && result !== null) {
      // Calculate final rotation to show the result at the top
      const numberIndex = wheelNumbers.indexOf(result);
      const segmentAngle = 360 / 37;
      const targetRotation = -(numberIndex * segmentAngle);

      // Add extra rotations for effect
      setRotation(prev => prev + (360 * 5) + targetRotation - (prev % 360));
      setBallRotation(prev => prev + (360 * 3));
    }
  }, [spinning, result]);

  const getNumberColorText = (num: number): string => {
    const color = getNumberColor(num);
    if (color === 'green') return 'text-green-400';
    if (color === 'red') return 'text-red-400';
    return 'text-gray-400';
  };

  const segmentAngle = 360 / 37;

  return (
    <div className="flex flex-col items-center">
      {/* Wheel Container */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Outer rim */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 border-8 border-amber-800"
          style={{
            boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)'
          }}
        />

        {/* Rotating wheel */}
        <div
          className="absolute inset-4 rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'none' : 'transform 1s ease-out',
            background: 'conic-gradient(' +
              wheelNumbers.map((num, i) => {
                const color = getNumberColor(num);
                const hexColor = color === 'green' ? '#22c55e' : color === 'red' ? '#ef4444' : '#1f2937';
                const startAngle = i * segmentAngle;
                const endAngle = (i + 1) * segmentAngle;
                return `${hexColor} ${startAngle}deg ${endAngle}deg`;
              }).join(', ') +
              ')'
          }}
        >
          {/* Number markers */}
          {wheelNumbers.map((num, i) => (
            <div
              key={num}
              className="absolute text-white font-pixel text-xs md:text-sm"
              style={{
                left: '50%',
                top: '8%',
                transformOrigin: '50% 120px',
                transform: `translateX(-50%) rotate(${i * segmentAngle}deg) translateY(20px)`,
                textShadow: '1px 1px 2px black'
              }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Center decoration */}
        <div className="absolute inset-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center border-4 border-amber-900"
          style={{
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
          }}
        >
          {/* Casino logo / decoration */}
          <div className="text-center">
            <div className="text-2xl md:text-3xl">🎰</div>
            <div className="text-xs font-pixel text-amber-100 mt-1">CASINO</div>
          </div>
        </div>

        {/* Ball */}
        <div
          className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full bg-white"
          style={{
            transform: `rotate(${ballRotation}deg)`,
            transition: spinning ? 'none' : 'transform 0.5s ease-out',
            boxShadow: '0 0 5px rgba(255,255,255,0.8)',
            top: '12%',
            left: '50%',
            marginLeft: '-6px',
            marginTop: '-6px'
          }}
        />

        {/* Pointer/Marker at top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-400"
            style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}
          />
        </div>
      </div>

      {/* Result Display */}
      {result !== null && !spinning && (
        <PixelCard className="mt-4 p-4 bg-gray-800" variant="gold">
          <div className="text-center">
            <div className="text-sm font-pixel text-gray-400 mb-2">RESULT</div>
            <div className={`text-4xl font-pixel ${getNumberColorText(result)}`}>
              {result} {getNumberColor(result) === 'red' ? '🔴' : getNumberColor(result) === 'black' ? '⚫' : '🟢'}
            </div>
            <div className="text-xs font-pixel text-gray-400 mt-1">
              {getNumberColor(result) === 'red' ? 'RED' : getNumberColor(result) === 'black' ? 'BLACK' : 'GREEN'}
              {result !== 0 && ` • ${result % 2 === 0 ? 'EVEN' : 'ODD'} • ${result >= 19 ? 'HIGH' : 'LOW'}`}
            </div>
          </div>
        </PixelCard>
      )}

      {/* Spinning indicator */}
      {spinning && (
        <div className="mt-4 text-center">
          <div className="text-lg font-pixel text-amber-400 animate-pulse">
            🎲 Spinning...
          </div>
        </div>
      )}
    </div>
  );
};
