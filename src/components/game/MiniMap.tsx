import React from 'react';
import { Room } from '../../types/game';
import { SidebarPanel } from '../layout/SidebarPanel';
import { Map } from 'lucide-react';
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
  // Show max 14 rooms (2 rows)
  const displayRooms = rooms.slice(0, 14);

  return (
    <SidebarPanel title="Floor Map" icon={Map} collapsible>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {displayRooms.map((room, index) => {
          const isCurrent = index === currentRoomIndex;
          const isVisited = visitedRoomIndices.includes(index);
          const colorClass = getRoomColorClass(room.type);

          return (
            <div
              key={room.id}
              className={`
                w-9 h-9 rounded-lg flex items-center justify-center text-sm
                border-2 ${colorClass}
                transition-all duration-200 ease-out
                cursor-pointer
                ${isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110 shadow-lg shadow-purple-500/30' : 'hover:scale-105 hover:shadow-md'}
                ${isVisited ? 'opacity-100 bg-gray-800/30' : 'opacity-50 grayscale'}
              `}
              title={room.type}
              role="img"
              aria-label={`${room.type}${isCurrent ? ' (current room)' : isVisited ? ' (visited)' : ' (unvisited)'}`}
            >
              {getRoomIcon(room.type)}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-400 mt-2.5 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
        <span>{visitedRoomIndices.length}/{rooms.length} explored</span>
      </div>
    </SidebarPanel>
  );
};
