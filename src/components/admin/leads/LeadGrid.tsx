
import React, { useMemo } from 'react';
import { Lead } from '@/types/lead';
import { ColDef } from 'ag-grid-community';
import AgGridWrapper from '@/components/common/grid/AgGridWrapper';
import LoadingSpinner from '@/components/admin/courses/table/LoadingSpinner';
import { useAgGridConfig } from '@/hooks/useAgGridConfig';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeadGridProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const LeadGrid: React.FC<LeadGridProps> = ({
  leads,
  loading,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
}) => {
  const {
    selectedRows,
    onGridReady,
    onSelectionChanged,
    handleBulkDelete
  } = useAgGridConfig<Lead>({ onBulkDelete });

  const getStageColor = (stage: Lead['stage']) => {
    switch (stage) {
      case 'New': return 'bg-blue-500';
      case 'Contacted': return 'bg-yellow-500';
      case 'Interested': return 'bg-purple-500';
      case 'Take admission': return 'bg-orange-500';
      case 'Converted': return 'bg-green-500';
      case 'Lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const columnDefs = useMemo<ColDef[]>(() => [
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
      headerName: 'Name',
      field: 'name',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Email',
      field: 'email',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Phone',
      field: 'phone',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Stage',
      field: 'stage',
      filter: true,
      sortable: true,
      cellRenderer: (params) => (
        <Badge className={`${getStageColor(params.value)} text-white`}>
          {params.value || 'Unknown'}
        </Badge>
      )
    },
    {
      headerName: 'Source',
      field: 'source',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Actions',
      sortable: false,
      filter: false,
      width: 150,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(params.data)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit(params.data)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(params.data)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ], [onView, onEdit, onDelete]);

  return (
    <div className="space-y-4 w-full">
      {selectedRows.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedRows.length}
          onBulkDelete={handleBulkDelete}
        />
      )}
      
      <AgGridWrapper
        rowData={leads}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        loading={loading}
        loadingComponent={<LoadingSpinner />}
      />
    </div>
  );
};

export default LeadGrid;
