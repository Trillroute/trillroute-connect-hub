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
  visibleColumns?: Record<string, boolean>;
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
  setSelectedLevelIds,
  visibleColumns = {}
}) => {
  // Define all available columns
  const allColumnConfigs = useMemo<ColumnConfig[]>(() => [
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
    },
    {
      field: 'studentPermissions',
      headerName: 'Student Permissions',
      sortable: false,
      filterable: true,
      valueFormatter: ({ value }) => {
        if (!value || !Array.isArray(value)) return '';
        return `${value.length} permissions`;
      }
    },
    {
      field: 'teacherPermissions',
      headerName: 'Teacher Permissions',
      sortable: false,
      filterable: true,
      valueFormatter: ({ value }) => {
        if (!value || !Array.isArray(value)) return '';
        return `${value.length} permissions`;
      }
    },
    {
      field: 'adminPermissions',
      headerName: 'Admin Permissions',
      sortable: false,
      filterable: true,
      valueFormatter: ({ value }) => {
        if (!value || !Array.isArray(value)) return '';
        return `${value.length} permissions`;
      }
    },
    {
      field: 'leadPermissions',
      headerName: 'Lead Permissions',
      sortable: false,
      filterable: true,
      valueFormatter: ({ value }) => {
        if (!value || !Array.isArray(value)) return '';
        return `${value.length} permissions`;
      }
    }
  ], []);

  // Filter columns based on visibility settings
  const visibleColumnConfigs = useMemo(() => {
    return allColumnConfigs.filter(column => 
      // Keep the column if it's not explicitly set to false
      // or if it's the name column (always show name)
      visibleColumns[column.field] !== false || column.field === 'name'
    );
  }, [allColumnConfigs, visibleColumns]);

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
      columnConfigs={visibleColumnConfigs}
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
