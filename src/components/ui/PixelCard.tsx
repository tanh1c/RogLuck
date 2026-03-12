import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'purple' | 'danger';
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const bgColors = {
    default: 'bg-gray-800',
    gold: 'bg-casino-gold',
    purple: 'bg-casino-purple',
    danger: 'bg-red-900',
  };

  return (
    <div
      className={`${bgColors[variant]} ${className} relative`}
      style={{
        boxShadow: `
          -4px 0 0 0 #000,
          4px 0 0 0 #000,
          0 -4px 0 0 #000,
          0 4px 0 0 #000
        `,
      }}
    >
      {children}
    </div>
  );
};
