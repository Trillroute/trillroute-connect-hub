
import React from 'react';
import { ColumnConfig } from '../types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Columns } from "lucide-react";

interface ColumnVisibilityMenuProps {
  columnConfigs: ColumnConfig[];
  columnVisibility: Record<string, boolean>;
  toggleColumnVisibility: (field: string, isVisible: boolean) => void;
}

const ColumnVisibilityMenu: React.FC<ColumnVisibilityMenuProps> = ({
  columnConfigs,
  columnVisibility,
  toggleColumnVisibility
}) => {
  if (columnConfigs.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto flex items-center gap-1"
        >
          <Columns className="h-4 w-4" />
          <span>Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        {columnConfigs.map((column, index) => (
          <DropdownMenuCheckboxItem
            key={column.field}
            checked={columnVisibility[column.field] !== false}
            onCheckedChange={(checked) => toggleColumnVisibility(column.field, checked)}
            disabled={index === 0} // Disable first column (usually name or ID)
          >
            {column.headerName}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibilityMenu;
