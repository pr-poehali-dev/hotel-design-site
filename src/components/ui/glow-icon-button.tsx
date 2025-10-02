import React from 'react';
import './glow-icon-button.css';

interface GlowIconButtonProps {
  href: string;
  icon: React.ReactNode;
  glowColor?: string;
}

export const GlowIconButton = ({ href, icon, glowColor = '#ffee10' }: GlowIconButtonProps) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="glow-icon-link"
      style={{ 
        '--glow-color': glowColor 
      } as React.CSSProperties}
    >
      {icon}
    </a>
  );
};
