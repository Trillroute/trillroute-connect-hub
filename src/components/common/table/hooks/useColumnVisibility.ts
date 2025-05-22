
import { useState, useMemo } from 'react';
import { ColumnConfig } from '../types';

export const useColumnVisibility = (initialColumnConfigs: ColumnConfig[]) => {
  // Initialize column visibility state
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    initialColumnConfigs.reduce((acc, column) => {
      acc[column.field] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Toggle column visibility
  const toggleColumnVisibility = (field: string, isVisible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [field]: isVisible
    }));
  };

  return {
    columnVisibility,
    toggleColumnVisibility
  };
};
