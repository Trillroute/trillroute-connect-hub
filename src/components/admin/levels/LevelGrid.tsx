
import React, { useMemo } from 'react';
import UnifiedDataGrid, { ColumnConfig } from '@/components/common/table/UnifiedDataGrid';

interface Level {
  id: string;
  name: string;
  description: string;
}

interface LevelGridProps {
  levels: Level[];
  loading: boolean;
  onEdit?: (level: Level) => void;
  onDelete?: (level: Level) => void;
  onView?: (level: Level) => void;
  onViewPermissions?: (level: Level) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedLevelIds?: string[];
  setSelectedLevelIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const LevelGrid: React.FC<LevelGridProps> = ({
  levels,
  loading,
  onEdit,
  onDelete,
  onView,
  onViewPermissions,
  onBulkDelete,
  selectedLevelIds = [],
  setSelectedLevelIds
}) => {
  const columnConfigs = useMemo<ColumnConfig[]>(() => [
    {
      field: 'name',
      headerName: 'Level Name'
    },
    {
      field: 'description',
      headerName: 'Description'
    }
  ], []);

  return (
    <UnifiedDataGrid
      data={levels}
      columnConfigs={columnConfigs}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView || onViewPermissions}
      onBulkDelete={onBulkDelete}
      selectedIds={selectedLevelIds}
      setSelectedIds={setSelectedLevelIds}
      emptyMessage="No levels found"
    />
  );
};

export default LevelGrid;
