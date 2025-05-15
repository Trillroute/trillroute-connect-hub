import React from 'react';
import { cn } from '@/lib/utils';

interface DisplayModeToggleProps {
  displayMode: 'both' | 'events' | 'slots';
  setDisplayMode: (mode: 'both' | 'events' | 'slots') => void;
}

const DisplayModeToggle: React.FC<DisplayModeToggleProps> = ({ displayMode, setDisplayMode }) => {
  // Keeping the functionality but hiding the UI
  return <></>;
};

export default DisplayModeToggle;
