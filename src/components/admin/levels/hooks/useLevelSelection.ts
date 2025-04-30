
import { useState } from 'react';

export function useLevelSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    selectedIds,
    setSelectedIds,
    clearSelection
  };
}
