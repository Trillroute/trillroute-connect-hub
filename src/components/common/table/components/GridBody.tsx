
import React from 'react';
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ColumnConfig } from '../types';

interface GridBodyProps {
  data: any[];
  columnConfigs: ColumnConfig[];
  emptyMessage: string;
  hasSelectionColumn: boolean;
  hasActionColumn: boolean;
  selectedIds: string[];
  getCellValue: (row: any, column: ColumnConfig) => any;
  getFormattedValue: (value: any, column: ColumnConfig) => any;
  handleRowSelection: (id: string) => void;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const GridBody: React.FC<GridBodyProps> = ({
  data,
  columnConfigs,
  emptyMessage,
  hasSelectionColumn,
  hasActionColumn,
  selectedIds,
  getCellValue,
  getFormattedValue,
  handleRowSelection,
  onView,
  onEdit,
  onDelete
}) => {
  if (data.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell 
            colSpan={(hasActionColumn ? columnConfigs.length + 2 : columnConfigs.length + 1)}
            className="text-center py-8"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {data.map((row) => (
        <TableRow key={row.id}>
          {hasSelectionColumn && (
            <TableCell>
              <Checkbox 
                checked={selectedIds.includes(row.id)}
                onCheckedChange={() => handleRowSelection(row.id)}
              />
            </TableCell>
          )}
          
          {columnConfigs.map((column, colIndex) => (
            <TableCell key={colIndex}>
              {column.cellRenderer ? (
                column.cellRenderer({ 
                  data: row, 
                  value: getCellValue(row, column)
                })
              ) : (
                getFormattedValue(getCellValue(row, column), column)
              )}
            </TableCell>
          ))}
          
          {hasActionColumn && (
            <TableCell>
              <div className="flex items-center gap-2">
                {onView && (
                  <Button variant="ghost" size="sm" onClick={() => onView(row)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(row)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default GridBody;
