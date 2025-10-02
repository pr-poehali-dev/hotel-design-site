import React, { ReactNode } from 'react';
import './bubble-button.css';

interface BubbleButtonProps {
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
}

export const BubbleButton = ({ 
  onClick, 
  children, 
  icon,
  variant = 'primary' 
}: BubbleButtonProps) => {
  return (
    <div className="button--bubble__container">
      <svg className="goo" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <button 
        className={`button button--bubble ${variant === 'secondary' ? 'button--bubble-secondary' : ''}`} 
        onClick={onClick}
      >
        <span className="flex items-center gap-2 justify-center">
          {icon && <span>{icon}</span>}
          {children}
        </span>
      </button>
      
      <div className="button--bubble__effect-container">
        <span className="circle top-left"></span>
        <span className="circle bottom-right"></span>
        <span className="effect-button"></span>
      </div>
    </div>
  );
};
