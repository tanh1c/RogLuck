import React from 'react';
import './Dice.css';

interface DiceProps {
  value: number; // 1-6
  rolling: boolean;
}

export const Dice: React.FC<DiceProps> = ({ value, rolling }) => {
  // Dot positions for each face (3x3 grid)
  // Positions: 1 2 3
  //            4 5 6
  //            7 8 9
  const dotPositions: Record<number, number[]> = {
    1: [5],                    // Center
    2: [1, 9],                 // Top-left, bottom-right
    3: [1, 5, 9],              // Diagonal
    4: [1, 3, 7, 9],           // Corners
    5: [1, 3, 5, 7, 9],        // Corners + center
    6: [1, 3, 4, 6, 7, 9],     // All except center
  };

  const positions = dotPositions[value] || dotPositions[1];

  return (
    <div className={`dice-container ${rolling ? 'rolling' : ''}`}>
      <div className="dice">
        <div className="dice-face">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pos) => (
            <div
              key={pos}
              className={`dot dot-${pos} ${positions.includes(pos) ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
