import React, { useState } from 'react';
import { PixelCard } from '../ui/PixelCard';
import { ChevronDown, type LucideIcon } from 'lucide-react';

interface SidebarPanelProps {
  title: string;
  icon?: LucideIcon | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({
  title,
  icon: Icon,
  children,
  className = '',
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const renderIcon = () => {
    if (!Icon) return null;

    // If it's a React component function (like Lucide icons), render it
    if (typeof Icon === 'function') {
      const IconComponent = Icon as React.ComponentType<React.SVGProps<SVGElement>>;
      return <IconComponent className="w-4 h-4 text-casino-gold" aria-hidden="true" />;
    }

    // If it's already a React node (emoji, custom JSX), render it directly
    return Icon;
  };

  return (
    <PixelCard className={`mb-4 ${className}`} variant="purple">
      {collapsible ? (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-3 hover:bg-purple-900/20 transition-all duration-200 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-casino-gold focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-expanded={!isCollapsed}
          aria-controls={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="flex items-center gap-2">
            {renderIcon()}
            <h3 className="text-sm font-pixel text-casino-gold">{title}</h3>
          </div>
          <ChevronDown
            className="w-4 h-4 text-casino-gold transition-transform duration-200 ease-out"
            style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
            aria-hidden="true"
          />
        </button>
      ) : (
        <div className="flex items-center gap-2 p-3 border-b border-casino-purple/30">
          {renderIcon()}
          <h3 className="text-sm font-pixel text-casino-gold">{title}</h3>
        </div>
      )}
      {(!collapsible || !isCollapsed) && (
        <div
          className="p-3 animate-fadeIn"
          id={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {children}
        </div>
      )}
    </PixelCard>
  );
};
