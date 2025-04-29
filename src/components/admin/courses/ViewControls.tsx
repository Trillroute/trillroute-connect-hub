
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Grid2x2, LayoutList, RefreshCw } from 'lucide-react';

interface ViewControlsProps {
  viewMode: 'list' | 'grid' | 'tile';
  setViewMode: (mode: 'list' | 'grid' | 'tile') => void;
  onRefresh: () => void;
  canAddCourse: boolean;
  onAddCourse: () => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  setViewMode,
  onRefresh,
  canAddCourse,
  onAddCourse
}) => {
  return (
    <div className="flex space-x-2 items-center">
      <Button 
        size="sm" 
        variant={viewMode === 'list' ? "secondary" : "outline"}
        onClick={() => setViewMode('list')}
        title="List view"
      >
        <LayoutList className="w-4 h-4" />
      </Button>
      <Button 
        size="sm" 
        variant={viewMode === 'grid' ? "secondary" : "outline"}
        onClick={() => setViewMode('grid')}
        title="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button 
        size="sm" 
        variant={viewMode === 'tile' ? "secondary" : "outline"}
        onClick={() => setViewMode('tile')}
        title="Tile view"
      >
        <Grid2x2 className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        onClick={onRefresh}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
      {canAddCourse && (
        <Button 
          onClick={onAddCourse}
          className="bg-primary text-white flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Course
        </Button>
      )}
    </div>
  );
};

export default ViewControls;
