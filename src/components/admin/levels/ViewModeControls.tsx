
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutList, LayoutGrid, Grid2x2 } from 'lucide-react';

export type ViewMode = 'list' | 'grid' | 'tile';

interface ViewModeControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeControls: React.FC<ViewModeControlsProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={viewMode === 'list' ? "secondary" : "outline"}
        onClick={() => onViewModeChange('list')}
        title="List view"
      >
        <LayoutList className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'grid' ? "secondary" : "outline"}
        onClick={() => onViewModeChange('grid')}
        title="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'tile' ? "secondary" : "outline"}
        onClick={() => onViewModeChange('tile')}
        title="Tile view"
      >
        <Grid2x2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ViewModeControls;
