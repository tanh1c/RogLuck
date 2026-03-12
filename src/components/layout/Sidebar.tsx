import React, { useState, useEffect } from 'react';
import { SidebarHUD } from './SidebarHUD';
import { CombatLog } from '../combat/CombatLog';
import { QuickStats } from '../meta/QuickStats';
import { MiniMap } from '../game/MiniMap';
import { Room } from '../../types/game';
import { ChevronDown } from 'lucide-react';

interface SidebarProps {
  rooms: Room[];
  currentRoomIndex: number;
  visitedRoomIndices: number[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  rooms,
  currentRoomIndex,
  visitedRoomIndices,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isVisible && window.innerWidth <= 640) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isVisible]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="sidebar-toggle btn-pixel bg-casino-purple text-white rounded-lg gap-2 hover:bg-purple-600 transition-colors"
        aria-expanded={isVisible}
        aria-controls="sidebar-content"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-150 ${isVisible ? 'rotate-180' : ''}`}
        />
        <span className="text-sm font-pixel">Info</span>
      </button>

      {/* Sidebar content */}
      <aside
        id="sidebar-content"
        className={`game-layout__right ${isVisible ? 'visible' : ''}`}
      >
        <SidebarHUD />
        {rooms.length > 0 && (
          <MiniMap
            rooms={rooms}
            currentRoomIndex={currentRoomIndex}
            visitedRoomIndices={visitedRoomIndices}
          />
        )}
        <CombatLog />
        <QuickStats />
      </aside>
    </>
  );
};
