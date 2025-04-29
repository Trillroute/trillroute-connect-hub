
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DataGridColumn {
  field: string;
  headerName: string;
  width?: number;
  cellRenderer?: (params: any) => React.ReactNode;
  checkboxSelection?: boolean;
  headerCheckboxSelection?: boolean;
  filter?: boolean;
  sortable?: boolean;
  valueGetter?: (params: any) => any;
  valueFormatter?: (params: any) => string;
}

interface DataGridProps {
  rowData: any[];
  columnDefs: DataGridColumn[];
  onSelectionChanged?: (selectedRows: any[]) => void;
  loading?: boolean;
  height?: string;
  className?: string;
}

const DataGrid: React.FC<DataGridProps> = ({
  rowData,
  columnDefs,
  onSelectionChanged,
  loading = false,
  height = "600px",
  className = "",
}) => {
  const [selectedRows, setSelectedRows] = React.useState<Record<string, boolean>>({});
  
  // Handle row selection
  const handleRowSelection = (id: string, checked: boolean) => {
    const newSelectedRows = { ...selectedRows, [id]: checked };
    setSelectedRows(newSelectedRows);
    
    if (onSelectionChanged) {
      const selectedRowData = rowData.filter(row => newSelectedRows[row.id]);
      onSelectionChanged(selectedRowData);
    }
  };
  
  // Handle header checkbox selection
  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {};
    
    if (checked) {
      rowData.forEach(row => {
        newSelectedRows[row.id] = true;
      });
    }
    
    setSelectedRows(newSelectedRows);
    
    if (onSelectionChanged) {
      const selectedRowData = checked ? [...rowData] : [];
      onSelectionChanged(selectedRowData);
    }
  };
  
  // Check if all rows are selected
  const areAllRowsSelected = rowData.length > 0 && 
    rowData.every(row => selectedRows[row.id]);
  
  // Check if some rows are selected
  const areSomeRowsSelected = !areAllRowsSelected && 
    rowData.some(row => selectedRows[row.id]);

  // Get cell value based on column definition
  const getCellValue = (row: any, column: DataGridColumn) => {
    if (column.valueGetter) {
      return column.valueGetter({ data: row });
    }
    return row[column.field];
  };

  // Format cell value if formatter provided
  const getFormattedCellValue = (value: any, column: DataGridColumn) => {
    if (column.valueFormatter) {
      return column.valueFormatter({ value });
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-md ${className}`} style={{ height }}>
      <ScrollArea className="h-full">
        <Table>
          <TableHeader>
            <TableRow>
              {columnDefs.map((column, index) => (
                <TableHead 
                  key={index} 
                  className="bg-muted/50"
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.headerCheckboxSelection ? (
                    <div className="flex items-center">
                      <Checkbox 
                        checked={areAllRowsSelected}
                        indeterminate={areSomeRowsSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </div>
                  ) : column.headerName}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnDefs.length} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              rowData.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex}>
                  {columnDefs.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.checkboxSelection ? (
                        <Checkbox 
                          checked={!!selectedRows[row.id]}
                          onCheckedChange={(checked) => handleRowSelection(row.id, !!checked)}
                        />
                      ) : column.cellRenderer ? (
                        column.cellRenderer({ data: row, value: getCellValue(row, column) })
                      ) : (
                        getFormattedCellValue(getCellValue(row, column), column)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default DataGrid;
