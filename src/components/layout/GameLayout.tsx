import React from 'react';
import { Sidebar } from './Sidebar';
import { Room } from '../../types/game';

interface GameLayoutProps {
  children: React.ReactNode;
  rooms: Room[];
  currentRoomIndex: number;
  visitedRoomIndices: number[];
  showSidebar: boolean;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  rooms,
  currentRoomIndex,
  visitedRoomIndices,
  showSidebar,
}) => {
  if (!showSidebar) {
    // Full-width mode for Menu, Character Select, etc.
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
        {children}
      </div>
    );
  }

  return (
    <div className="game-layout animate-fadeIn">
      <div className="game-layout__left">
        <div className="px-4 py-8 min-h-full">
          {children}
        </div>
      </div>
      <Sidebar
        rooms={rooms}
        currentRoomIndex={currentRoomIndex}
        visitedRoomIndices={visitedRoomIndices}
      />
    </div>
  );
};
