import React from 'react';

interface HighlighterProps {
  children: React.ReactNode;
  color?: string; // Classe colore tailwind opzionale
}

export const Highlighter = ({ children, color = "from-yellow-200 to-yellow-200" }: HighlighterProps) => {
  return (
    <span
      className={`
        bg-no-repeat 
        bg-bottom 
        bg-[length:100%_40%] 
        bg-gradient-to-r ${color}
        box-decoration-clone
        px-1
      `}
    >
      {children}
    </span>
  );
};