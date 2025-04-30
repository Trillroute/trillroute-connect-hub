
import { useState } from 'react';

interface UseGridSelectionProps {
  selectedIds?: string[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  data: any[];
}

export const useGridSelection = ({ 
  selectedIds = [], 
  setSelectedIds, 
  data 
}: UseGridSelectionProps) => {
  // Handle row selection
  const handleRowSelection = (id: string) => {
    if (!setSelectedIds) return;
    
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle select all
  const handleSelectAll = (filteredData: any[]) => {
    if (!setSelectedIds) return;
    
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      const allIds = filteredData.map(item => item.id);
      setSelectedIds(allIds);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = (onBulkDelete?: (ids: string[]) => void) => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
    }
  };

  return {
    handleRowSelection,
    handleSelectAll,
    handleBulkDelete
  };
};
