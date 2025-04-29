
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutList, LayoutGrid, Grid2x2, RefreshCw, Plus, Trash2 } from 'lucide-react';

export type ViewMode = 'list' | 'grid' | 'tile';

interface ViewControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onRefresh: () => void;
  onAddAdmin: () => void;
  selectedIds: string[];
  onBulkDelete: () => void;
  canAddAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
}

const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  setViewMode,
  onRefresh,
  onAddAdmin,
  selectedIds,
  onBulkDelete,
  canAddAdmin,
  isSuperAdmin,
  isLoading
}) => {
  return (
    <div className="flex flex-wrap space-x-2 items-center">
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
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      {(canAddAdmin || isSuperAdmin) && (
        <Button onClick={onAddAdmin}>
          <Plus className="h-4 w-4 mr-2" />
          Add Administrator
        </Button>
      )}
      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          onClick={onBulkDelete}
          className="ml-2"
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedIds.length})
        </Button>
      )}
    </div>
  );
};

export default ViewControls;
