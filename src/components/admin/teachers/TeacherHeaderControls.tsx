
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, LayoutGrid, Grid2x2, LayoutList, Trash2 } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface TeacherHeaderControlsProps {
  viewMode: 'list' | 'grid' | 'tile';
  setViewMode: (mode: 'list' | 'grid' | 'tile') => void;
  onRefresh: () => void;
  canAddUser: boolean;
  onAdd: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  isLoading: boolean;
}

const TeacherHeaderControls: React.FC<TeacherHeaderControlsProps> = ({
  viewMode,
  setViewMode,
  onRefresh,
  canAddUser,
  onAdd,
  selectedCount,
  onBulkDelete,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>Teacher Management</CardTitle>
        <CardDescription>Manage teacher accounts</CardDescription>
      </div>
      <div className="flex space-x-2 items-center">
        <Button size="sm"
          variant={viewMode === 'list' ? "secondary" : "outline"}
          onClick={() => setViewMode('list')}
          title="List view"
        >
          <LayoutList className="w-4 h-4" />
        </Button>
        <Button size="sm"
          variant={viewMode === 'grid' ? "secondary" : "outline"}
          onClick={() => setViewMode('grid')}
          title="Grid view"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button size="sm"
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
        {canAddUser && (
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        )}
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            onClick={onBulkDelete}
            className="ml-2"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default TeacherHeaderControls;
