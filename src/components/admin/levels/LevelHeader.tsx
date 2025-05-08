
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ViewModeControls from './ViewModeControls';

interface LevelHeaderProps {
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  columns: string[];
  setColumns: (columns: string[]) => void;
  selectedIds: string[];
  onBulkDelete?: () => void;
  onCreateClick?: () => void;
}

const LevelHeader: React.FC<LevelHeaderProps> = ({
  viewMode,
  setViewMode,
  columns,
  setColumns,
  selectedIds,
  onBulkDelete,
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
      <div>
        <h1 className="text-2xl font-bold">Admin Levels</h1>
        <p className="text-gray-500">Manage permission levels for administrators</p>
      </div>
      <div className="flex items-center space-x-2">
        <ViewModeControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          columns={columns}
          setColumns={setColumns}
        />
        {onCreateClick && (
          <Button onClick={onCreateClick} className="ml-2">
            <Plus className="h-4 w-4 mr-1" />
            New Level
          </Button>
        )}
        {selectedIds.length > 0 && onBulkDelete && (
          <Button
            variant="destructive"
            onClick={onBulkDelete}
            className="ml-2"
          >
            Delete ({selectedIds.length})
          </Button>
        )}
      </div>
    </div>
  );
};

export default LevelHeader;
