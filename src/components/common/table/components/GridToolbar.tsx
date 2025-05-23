
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface GridToolbarProps {
  selectedIds: string[];
  activeFiltersCount: number;
  onBulkDelete?: (ids: string[]) => void;
  clearAllFilters: () => void;
}

const GridToolbar: React.FC<GridToolbarProps> = ({
  selectedIds,
  activeFiltersCount,
  onBulkDelete,
  clearAllFilters
}) => {
  if (selectedIds.length === 0 && activeFiltersCount === 0) {
    return null;
  }

  return (
    <div className="flex justify-between items-center">
      {selectedIds.length > 0 && onBulkDelete && (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onBulkDelete(selectedIds)}
        >
          Delete Selected ({selectedIds.length})
        </Button>
      )}
      
      <div className="flex-1"></div>
      
      {activeFiltersCount > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearAllFilters}
          className="flex items-center gap-1 mr-2"
        >
          <X className="h-4 w-4" />
          <span>Clear all filters ({activeFiltersCount})</span>
        </Button>
      )}
    </div>
  );
};

export default GridToolbar;
