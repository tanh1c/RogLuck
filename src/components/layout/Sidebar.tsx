import React, { useState, useEffect } from 'react';
import { SidebarHUD } from './SidebarHUD';
import { CombatLog } from '../combat/CombatLog';
import { QuickStats } from '../meta/QuickStats';
import { MiniMap } from '../game/MiniMap';
import { Room } from '../../types/game';
import { ChevronDown, Info } from 'lucide-react';

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
        className="sidebar-toggle btn-pixel bg-casino-purple text-white rounded-lg gap-2 hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
        aria-expanded={isVisible}
        aria-controls="sidebar-content"
        aria-label={isVisible ? 'Close info panel' : 'Open info panel'}
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ease-out ${isVisible ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
        <Info className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm font-pixel">Info</span>
      </button>

      {/* Sidebar content */}
      <aside
        id="sidebar-content"
        className={`game-layout__right ${isVisible ? 'visible' : ''}`}
        role="complementary"
        aria-label="Game information sidebar"
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
