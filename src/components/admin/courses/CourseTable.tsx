import React, { useState, useCallback, useMemo } from 'react';
import { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toast } from '@/hooks/use-toast';

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
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Define column definitions for AG Grid
  const columnDefs = useMemo<ColDef<Course>[]>(() => [
    {
      headerName: '',
      field: 'id',
      width: 50,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      sortable: false,
    },
    {
      headerName: 'Course',
      field: 'title',
      filter: true,
      sortable: true,
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams<Course>) => {
        const course = params.data as Course;
        return (
          <div className="flex items-center gap-3">
            {course.image && (
              <img
                src={course.image}
                alt={course.title}
                className="h-10 w-10 rounded object-cover flex-shrink-0"
              />
            )}
            <div className="overflow-hidden">
              <div className="font-semibold truncate">{course.title}</div>
              <div className="text-xs text-gray-500 truncate">
                {course.level} • {course.skill}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      headerName: 'Level',
      field: 'level',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Skill',
      field: 'skill',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Duration',
      field: 'duration',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Actions',
      sortable: false,
      filter: false,
      width: 150,
      cellRenderer: (params: ICellRendererParams<Course>) => {
        return (
          <div className="flex items-center gap-2">
            {onView && (
              <Button variant="ghost" size="sm" onClick={() => onView(params.data as Course)}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(params.data as Course)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={() => onDelete(params.data as Course)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      }
    }
  ], [onView, onEdit, onDelete]);

  // Grid ready event handler to set default column settings
  const onGridReady = useCallback((params: any) => {
    try {
      params.api.sizeColumnsToFit();
      console.log('AG Grid is ready and sized:', params.api);
      // Force refresh the grid
      setTimeout(() => {
        params.api.redrawRows();
        console.log('AG Grid rows redrawn');
      }, 100);
    } catch (err) {
      console.error('Error in onGridReady:', err);
      toast({
        title: "Grid initialization error",
        description: "There was an issue loading the course table.",
        variant: "destructive"
      });
    }
  }, []);

  // Row selection change handler
  const onSelectionChanged = useCallback((event: any) => {
    console.log('Selection changed:', event);
    const selected = event.api.getSelectedRows().map((row: Course) => row.id);
    setSelectedRows(selected);
  }, []);

  // Handle bulk delete action
  const handleBulkDelete = useCallback(() => {
    if (onBulkDelete && selectedRows.length > 0) {
      onBulkDelete(selectedRows);
      setSelectedRows([]);
    }
  }, [onBulkDelete, selectedRows]);

  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  console.log('Rendering AG Grid with courses:', courses.length);
  console.log('First course:', courses[0]);
  
  return (
    <div className="space-y-4 w-full">
      {selectedRows.length > 0 && onBulkDelete && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            Delete Selected ({selectedRows.length})
          </Button>
        </div>
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
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            filter: true,
            floatingFilter: true,
            resizable: true,
          }}
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
