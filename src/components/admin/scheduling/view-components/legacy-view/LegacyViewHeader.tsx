
import React from 'react';

interface LegacyViewHeaderProps {
  displayMode: 'both' | 'events' | 'slots';
  setDisplayMode: (mode: 'both' | 'events' | 'slots') => void;
}

const LegacyViewHeader: React.FC<LegacyViewHeaderProps> = ({ displayMode, setDisplayMode }) => {
  return (
    <div className="p-4 bg-card border-b"></div>
  );
};

export default LegacyViewHeader;
