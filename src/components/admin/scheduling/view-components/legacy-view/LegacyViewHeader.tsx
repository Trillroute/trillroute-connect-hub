
import React from 'react';
import DisplayModeToggle from './DisplayModeToggle';

interface LegacyViewHeaderProps {
  displayMode: 'both' | 'events' | 'slots';
  setDisplayMode: (mode: 'both' | 'events' | 'slots') => void;
}

const LegacyViewHeader: React.FC<LegacyViewHeaderProps> = ({ displayMode, setDisplayMode }) => {
  return (
    <div className="p-4 bg-card border-b">
      <h3 className="font-medium text-primary">Schedule View</h3>
      <p className="text-sm text-muted-foreground">
        Shows consolidated availability and events in a day-based view
      </p>
      
      <DisplayModeToggle displayMode={displayMode} setDisplayMode={setDisplayMode} />
    </div>
  );
};

export default LegacyViewHeader;
