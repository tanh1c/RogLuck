import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SidebarPanel } from '../layout/SidebarPanel';
import { MessageSquare } from 'lucide-react';

export const CombatLog: React.FC = () => {
  const { combatLog } = useGameStore();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combatLog]);

  // Show last 10 entries as per UI/UX review
  const recentLogs = combatLog.slice(-10);

  return (
    <SidebarPanel title="Combat Log" icon="💬" collapsible className="combat-log-panel">
      <div
        ref={logRef}
        className="h-32 overflow-y-auto text-xs space-y-1 font-mono scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800"
      >
        {recentLogs.length === 0 ? (
          <p className="text-gray-500 italic">No combat events yet...</p>
        ) : (
          recentLogs.map((log, index) => (
            <div
              key={index}
              className="text-gray-300 border-l-2 border-casino-purple/30 pl-2 py-1 hover:bg-purple-900/10 transition-colors"
            >
              {log}
            </div>
          ))
        )}
      </div>
    </SidebarPanel>
  );
};
