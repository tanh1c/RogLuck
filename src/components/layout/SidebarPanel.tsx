import React, { useState } from 'react';
import { PixelCard } from '../ui/PixelCard';
import { ChevronDown } from 'lucide-react';

interface SidebarPanelProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({
  title,
  icon,
  children,
  className = '',
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <PixelCard className={`mb-4 ${className}`} variant="purple">
      {collapsible ? (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-3 hover:bg-purple-900/20 transition-colors duration-150"
          aria-expanded={!isCollapsed}
          aria-controls={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg" aria-hidden="true">{icon}</span>}
            <h3 className="text-sm font-pixel text-casino-gold">{title}</h3>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-casino-gold transition-transform duration-150`}
            style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
          />
        </button>
      ) : (
        <div className="flex items-center gap-2 p-3 border-b border-casino-purple/30">
          {icon && <span className="text-lg" aria-hidden="true">{icon}</span>}
          <h3 className="text-sm font-pixel text-casino-gold">{title}</h3>
        </div>
      )}
      {(!collapsible || !isCollapsed) && (
        <div className="p-3" id={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {children}
        </div>
      )}
    </PixelCard>
  );
};
