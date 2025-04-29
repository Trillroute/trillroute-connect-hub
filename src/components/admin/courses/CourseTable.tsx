
import React, { useMemo } from 'react';
import { Course } from '@/types/course';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useAgGridConfig } from '@/hooks/useAgGridConfig';
import BulkDeleteButton from './table/BulkDeleteButton';
import LoadingSpinner from './table/LoadingSpinner';
import { defaultColDef } from './table/defaultColDef';
import { getCourseColumnDefs } from './table/columnDefs';

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onView?: (course: Course) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  loading,
  onEdit,
  onDelete,
  onView,
  onBulkDelete
}) => {
  const {
    selectedRows,
    onGridReady,
    onSelectionChanged,
    handleBulkDelete
  } = useAgGridConfig<Course>({ onBulkDelete });

  // Define column definitions for AG Grid
  const columnDefs = useMemo(() => 
    getCourseColumnDefs(onView, onEdit, onDelete),
    [onView, onEdit, onDelete]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log('Rendering AG Grid with courses:', courses.length);
  if (courses.length > 0) {
    console.log('First course:', courses[0]);
  }
  
  return (
    <div className="space-y-4 w-full">
      {selectedRows.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedRows.length}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <div 
        className="ag-theme-alpine w-full" 
        style={{ 
          height: '600px', 
          width: '100%',
        }}
      >
        <AgGridReact
          rowData={courses}
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
    </div>
  );
};

export default CourseTable;
