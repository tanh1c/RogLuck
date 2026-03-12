import React from 'react';
import { Room } from '../../types/game';
import { SidebarPanel } from '../layout/SidebarPanel';
import { getRoomIcon, getRoomColorClass } from '../../utils/floor-generator';

interface MiniMapProps {
  rooms: Room[];
  currentRoomIndex: number;
  visitedRoomIndices: number[];
}

export const MiniMap: React.FC<MiniMapProps> = ({
  rooms,
  currentRoomIndex,
  visitedRoomIndices,
}) => {
  // Show max 14 rooms (2 rows) as per UI/UX review
  const displayRooms = rooms.slice(0, 14);

  return (
    <SidebarPanel title="Floor Map" icon="🗺️" collapsible>
      <div className="flex flex-wrap gap-1 justify-center">
        {displayRooms.map((room, index) => {
          const isCurrent = index === currentRoomIndex;
          const isVisited = visitedRoomIndices.includes(index);
          const colorClass = getRoomColorClass(room.type);

          return (
            <div
              key={room.id}
              className={`
                w-8 h-8 rounded flex items-center justify-center text-xs
                border-2 ${colorClass}
                transition-all duration-150
                ${isCurrent ? 'ring-2 ring-white scale-110' : ''}
                ${isVisited ? 'opacity-100' : 'opacity-50'}
              `}
              title={room.type}
            >
              {getRoomIcon(room.type)}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center">
        {visitedRoomIndices.length}/{rooms.length} explored
      </div>
    </SidebarPanel>
  );
};
