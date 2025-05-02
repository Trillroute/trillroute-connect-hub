
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutList, LayoutGrid, Grid2x2, Columns } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ViewMode = 'list' | 'grid' | 'tile';

interface ViewModeControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  visibleColumns?: Record<string, boolean>;
  onColumnVisibilityChange?: (column: string, isVisible: boolean) => void;
  columnOptions?: { field: string, label: string }[];
}

const ViewModeControls: React.FC<ViewModeControlsProps> = ({
  viewMode,
  onViewModeChange,
  visibleColumns = {},
  onColumnVisibilityChange,
  columnOptions = [],
}) => {
  return (
    <div className="flex gap-2 mb-4 items-center">
      <Button
        size="sm"
        variant={viewMode === 'list' ? "secondary" : "outline"}
        onClick={() => onViewModeChange('list')}
        title="List view"
      >
        <LayoutList className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'grid' ? "secondary" : "outline"}
        onClick={() => onViewModeChange('grid')}
        title="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'tile' ? "secondary" : "outline"}
        onClick={() => onViewModeChange('tile')}
        title="Tile view"
      >
        <Grid2x2 className="w-4 h-4" />
      </Button>
      
      {onColumnVisibilityChange && columnOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              title="Column visibility"
              className="ml-2"
            >
              <Columns className="w-4 h-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-background z-50" 
            sideOffset={5}
          >
            {columnOptions.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.field}
                checked={visibleColumns[column.field] !== false} // Default to true if not set
                onCheckedChange={(checked) => {
                  if (onColumnVisibilityChange) {
                    onColumnVisibilityChange(column.field, checked);
                  }
                }}
                disabled={column.field === 'name'} // Name column always visible
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ViewModeControls;
