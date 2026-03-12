import React from 'react';
import { Room } from '../../types/game';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';
import { getRoomIcon, getRoomColorClass, getRoomDisplayName } from '../../utils/floor-generator';

interface FloorMapProps {
  floorNumber: number;
  rooms: Room[];
  currentRoomIndex: number;
  visitedRoomIndices: number[];
  onRoomEnter: (roomIndex: number) => void;
  onNextFloor: () => void;
  canProceedToNextFloor: boolean;
}

export const FloorMap: React.FC<FloorMapProps> = ({
  floorNumber,
  rooms,
  currentRoomIndex,
  visitedRoomIndices,
  onRoomEnter,
  onNextFloor,
  canProceedToNextFloor,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Floor Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-pixel text-casino-gold mb-2">
          Floor {floorNumber}
        </h2>
        <p className="text-gray-400 text-sm">
          {visitedRoomIndices.length} of {rooms.length} rooms explored
        </p>
      </div>

      {/* Room Map */}
      <PixelCard className="p-6 mb-6" variant="purple">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {rooms.map((room, index) => {
            const isCurrentRoom = index === currentRoomIndex;
            const isVisited = visitedRoomIndices.includes(index);
            const roomColor = getRoomColorClass(room.type);
            const roomIcon = getRoomIcon(room.type);

            return (
              <button
                key={room.id}
                onClick={() => onRoomEnter(index)}
                disabled={isCurrentRoom}
                className={`
                  relative flex flex-col items-center justify-center
                  w-24 h-24 md:w-28 md:h-28
                  border-4 ${roomColor}
                  rounded-lg
                  transition-all duration-150
                  ${isCurrentRoom ? 'ring-4 ring-white scale-110' : 'hover:scale-105'}
                  ${isVisited ? 'opacity-100' : 'opacity-80'}
                  disabled:cursor-default
                `}
                style={{
                  boxShadow: isCurrentRoom
                    ? '0 0 20px rgba(255,255,255,0.3)'
                    : '4px 4px 0 rgba(0,0,0,0.3)',
                }}
              >
                {/* Room Icon */}
                <span className="text-3xl md:text-4xl mb-2">{roomIcon}</span>

                {/* Room Type Label */}
                <span className="text-xs font-pixel text-white text-center leading-tight">
                  {room.type === 'gambling' ? 'Gamble' : room.type}
                </span>

                {/* Visited Indicator */}
                {isVisited && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                )}

                {/* Current Room Indicator */}
                {isCurrentRoom && (
                  <div className="absolute -bottom-1 text-xs font-pixel text-white bg-casino-purple px-2 py-0.5 rounded">
                    YOU
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </PixelCard>

      {/* Room Info Panel */}
      {currentRoomIndex >= 0 && rooms[currentRoomIndex] && (
        <PixelCard className="p-4 mb-6" variant="default">
          <div className="flex items-center gap-4">
            <span className="text-4xl">
              {getRoomIcon(rooms[currentRoomIndex].type)}
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-pixel text-casino-gold">
                {getRoomDisplayName(rooms[currentRoomIndex].type)}
              </h3>
              <p className="text-gray-400 text-sm">
                {rooms[currentRoomIndex].enemy
                  ? `Enemy: ${rooms[currentRoomIndex].enemy?.name} (HP: ${rooms[currentRoomIndex].enemy?.hp})`
                  : rooms[currentRoomIndex].reward
                  ? `Reward: ${rooms[currentRoomIndex].reward?.type === 'gold' ? `${rooms[currentRoomIndex].reward?.amount} Gold` : rooms[currentRoomIndex].reward?.type}`
                  : rooms[currentRoomIndex].type === 'rest'
                  ? 'Restore HP and remove debuffs'
                  : rooms[currentRoomIndex].type === 'shop'
                  ? 'Buy cards and relics'
                  : 'Enter to explore'}
              </p>
            </div>
            <PixelButton
              onClick={() => onRoomEnter(currentRoomIndex)}
              variant="primary"
              className="btn-pixel"
            >
              Enter
            </PixelButton>
          </div>
        </PixelCard>
      )}

      {/* Next Floor Button */}
      <div className="text-center">
        <PixelButton
          onClick={onNextFloor}
          variant={canProceedToNextFloor ? 'primary' : 'secondary'}
          disabled={!canProceedToNextFloor}
          className="btn-pixel px-8 py-4 text-lg"
        >
          {canProceedToNextFloor
            ? floorNumber === 10
              ? '🏆 Complete Run!'
              : `⬇️ Descend to Floor ${floorNumber + 1}`
            : `🔒 Clear all rooms first (${visitedRoomIndices.length}/${rooms.length})`}
        </PixelButton>
      </div>
    </div>
  );
};
