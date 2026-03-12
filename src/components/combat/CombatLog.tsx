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

  // Show last 10 entries
  const recentLogs = combatLog.slice(-10);

  return (
    <SidebarPanel
      title="Combat Log"
      icon={MessageSquare}
      collapsible
      className="combat-log-panel"
    >
      <div
        ref={logRef}
        className="h-32 overflow-y-auto text-xs space-y-1.5 font-mono scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent hover:scrollbar-thumb-purple-500"
        role="log"
        aria-label="Combat event log"
      >
        {recentLogs.length === 0 ? (
          <p className="text-gray-500 italic py-2">No combat events yet...</p>
        ) : (
          recentLogs.map((log, index) => (
            <div
              key={index}
              className="text-gray-300 border-l-2 border-purple-500/40 pl-2.5 py-1.5 hover:bg-purple-900/20 rounded-r transition-all duration-200 animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {log}
            </div>
          ))
        )}
      </div>
    </SidebarPanel>
  );
};
