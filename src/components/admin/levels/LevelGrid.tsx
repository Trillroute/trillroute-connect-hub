import React, { useMemo, useState } from 'react';
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
  // Use state to manage column configurations including order
  const [columnOrder, setColumnOrder] = useState<string[]>([
    'name', 'description', 'studentPermissions', 'teacherPermissions', 
    'adminPermissions', 'leadPermissions', 'coursePermissions', 'levelPermissions'
  ]);
  
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
    },
    {
      field: 'coursePermissions',
      headerName: 'Course Permissions',
      sortable: false,
      filterable: true,
      valueFormatter: ({ value }) => {
        if (!value || !Array.isArray(value)) return '';
        return `${value.length} permissions`;
      }
    },
    {
      field: 'levelPermissions',
      headerName: 'Level Permissions',
      sortable: false,
      filterable: true,
      valueFormatter: ({ value }) => {
        if (!value || !Array.isArray(value)) return '';
        return `${value.length} permissions`;
      }
    }
  ], []);

  // Filter and order columns based on visibility settings and current order
  const visibleColumnConfigs = useMemo(() => {
    // Filter columns based on visibility first
    const visibleCols = allColumnConfigs.filter(column => 
      // Keep the column if it's not explicitly set to false
      // or if it's the name column (always show name)
      visibleColumns[column.field] !== false || column.field === 'name'
    );
    
    // Sort columns based on the current column order
    return [...visibleCols].sort((a, b) => {
      const indexA = columnOrder.indexOf(a.field);
      const indexB = columnOrder.indexOf(b.field);
      return indexA - indexB;
    });
  }, [allColumnConfigs, visibleColumns, columnOrder]);

  // Map levels to have string IDs for UnifiedDataGrid
  const formattedLevels = useMemo(() => {
    return levels.map(level => ({
      ...level,
      id: String(level.id)
    }));
  }, [levels]);

  // Handle column reordering
  const handleColumnReorder = (draggedField: string, targetField: string) => {
    if (draggedField === targetField) return;
    
    setColumnOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const draggedIndex = newOrder.indexOf(draggedField);
      const targetIndex = newOrder.indexOf(targetField);
      
      // Remove the dragged item
      newOrder.splice(draggedIndex, 1);
      // Insert at the target position
      newOrder.splice(targetIndex, 0, draggedField);
      
      return newOrder;
    });
  };

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
      onColumnReorder={handleColumnReorder}
    />
  );
};

export default LevelGrid;
