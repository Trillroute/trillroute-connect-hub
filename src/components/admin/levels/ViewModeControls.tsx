
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Grid2X2, LayoutList, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewMode } from './hooks/useLevelDisplay';

interface ViewModeControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  columns: string[];
  setColumns: (columns: string[]) => void;
}

const ViewModeControls: React.FC<ViewModeControlsProps> = ({
  viewMode,
  setViewMode,
  columns,
  setColumns,
}) => {
  const toggleColumn = (column: string) => {
    const updatedColumns = columns.includes(column)
      ? columns.filter((col) => col !== column)
      : [...columns, column];
    
    setColumns(updatedColumns);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="border rounded-md overflow-hidden flex">
        <Button
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          className="rounded-none"
          onClick={() => setViewMode('table')}
          size="sm"
        >
          <LayoutList className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          className="rounded-none"
          onClick={() => setViewMode('grid')}
          size="sm"
        >
          <Grid2X2 className="h-4 w-4" />
        </Button>
      </div>
      
      {viewMode === 'table' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={columns.includes('name')}
              onCheckedChange={() => toggleColumn('name')}
            >
              Name
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columns.includes('description')}
              onCheckedChange={() => toggleColumn('description')}
            >
              Description
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columns.includes('permissions')}
              onCheckedChange={() => toggleColumn('permissions')}
            >
              Permissions
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ViewModeControls;
