
import { useState, useCallback } from 'react';
import { ViewMode } from '../ViewModeControls';

export function useLevelDisplay() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    description: true,
    studentPermissions: true,
    teacherPermissions: true,
    adminPermissions: true,
    leadPermissions: true,
    coursePermissions: true,
    levelPermissions: true
  });
  
  // Column options for dropdown
  const columnOptions = [
    { field: 'name', label: 'Level Name' },
    { field: 'description', label: 'Description' },
    { field: 'studentPermissions', label: 'Student Permissions' },
    { field: 'teacherPermissions', label: 'Teacher Permissions' },
    { field: 'adminPermissions', label: 'Admin Permissions' },
    { field: 'leadPermissions', label: 'Lead Permissions' },
    { field: 'coursePermissions', label: 'Course Permissions' },
    { field: 'levelPermissions', label: 'Level Permissions' }
  ];

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((field: string, isVisible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [field]: isVisible
    }));
  }, []);

  return {
    viewMode,
    setViewMode,
    visibleColumns,
    toggleColumnVisibility,
    columnOptions
  };
}
