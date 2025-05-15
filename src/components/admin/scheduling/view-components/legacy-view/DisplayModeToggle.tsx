
import React from 'react';
import { cn } from '@/lib/utils';

interface DisplayModeToggleProps {
  displayMode: 'both' | 'events' | 'slots';
  setDisplayMode: (mode: 'both' | 'events' | 'slots') => void;
}

const DisplayModeToggle: React.FC<DisplayModeToggleProps> = ({ displayMode, setDisplayMode }) => {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <button 
        onClick={() => setDisplayMode('both')}
        className={cn(
          "px-2 py-1 text-xs rounded",
          displayMode === 'both' 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}
      >
        Both
      </button>
      <button 
        onClick={() => setDisplayMode('events')}
        className={cn(
          "px-2 py-1 text-xs rounded", 
          displayMode === 'events' 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}
      >
        Events Only
      </button>
      <button 
        onClick={() => setDisplayMode('slots')}
        className={cn(
          "px-2 py-1 text-xs rounded", 
          displayMode === 'slots' 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}
      >
        Slots Only
      </button>
    </div>
  );
};

export default DisplayModeToggle;
