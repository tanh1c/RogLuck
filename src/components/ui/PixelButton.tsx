import React from 'react';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const variants = {
    primary: 'bg-casino-gold text-casino-dark hover:bg-yellow-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} ${className}
        font-pixel px-6 py-3
        transition-all duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        active:translate-y-1
      `}
      style={{
        boxShadow: disabled
          ? 'none'
          : `
            0 4px 0 #00000030,
            0 5px 0 #00000050,
            0 6px 4px #00000030
          `,
        transform: 'translateY(0)',
      }}
    >
      {children}
    </button>
  );
};
