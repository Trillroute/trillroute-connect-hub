
import React, { ReactNode, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { defaultColDef } from '@/components/admin/courses/table/defaultColDef';

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
  useEffect(() => {
    console.log('AgGridWrapper rendering with rowData length:', rowData?.length);
  }, [rowData]);

  if (loading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  const handleGridReady = (params: any) => {
    console.log('AG Grid is ready');
    
    if (params.api) {
      // Ensure columns are sized properly
      params.api.sizeColumnsToFit();
      
      // Force refresh the grid after a short delay to ensure it's displayed correctly
      setTimeout(() => {
        params.api.redrawRows();
        console.log('AG Grid rows redrawn');
      }, 100);
    }
    
    // Call the original onGridReady if provided
    if (onGridReady) {
      onGridReady(params);
    }
  };

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
        onGridReady={handleGridReady}
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
