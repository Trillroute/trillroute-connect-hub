
import React, { ReactNode } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { defaultColDef } from '@/components/admin/courses/table/defaultColDef';

// Register required AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface AgGridWrapperProps {
  rowData: any[];
  columnDefs: any[];
  onGridReady?: (params: any) => void;
  onSelectionChanged?: (event: any) => void;
  loading?: boolean;
  loadingComponent?: ReactNode;
  height?: string;
  className?: string;
}

const AgGridWrapper: React.FC<AgGridWrapperProps> = ({
  rowData,
  columnDefs,
  onGridReady,
  onSelectionChanged,
  loading = false,
  loadingComponent,
  height = '600px',
  className = '',
}) => {
  if (loading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  return (
    <div 
      className={`ag-theme-alpine w-full ${className}`}
      style={{ 
        height, 
        width: '100%',
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="multiple"
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        suppressRowClickSelection={true}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        suppressLoadingOverlay={true}
        domLayout="normal"
        animateRows={true}
        enableCellTextSelection={true}
        ensureDomOrder={true}
      />
    </div>
  );
};

export default AgGridWrapper;
