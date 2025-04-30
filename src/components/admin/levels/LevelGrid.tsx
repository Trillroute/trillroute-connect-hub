
import React, { useMemo } from 'react';
import UnifiedDataGrid, { ColumnConfig } from '@/components/common/table/UnifiedDataGrid';
import { Level } from './LevelTable';

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
      headerName: 'Level Name',
      sortable: true,
      filterable: true
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      filterable: true
    }
  ], []);

  // Map levels to have string IDs for UnifiedDataGrid
  const formattedLevels = useMemo(() => {
    return levels.map(level => ({
      ...level,
      id: String(level.id)
    }));
  }, [levels]);

  return (
    <UnifiedDataGrid
      data={formattedLevels}
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
