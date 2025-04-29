
import React, { useMemo } from 'react';
import { Lead } from '@/types/lead';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DataGrid, { DataGridColumn } from '@/components/common/table/DataGrid';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';

interface LeadGridProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedLeadIds?: string[];
  setSelectedLeadIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const LeadGrid: React.FC<LeadGridProps> = ({
  leads,
  loading,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
  selectedLeadIds = [],
  setSelectedLeadIds
}) => {
  const handleSelectionChanged = (selectedRows: Lead[]) => {
    if (setSelectedLeadIds) {
      const ids = selectedRows.map(row => row.id);
      setSelectedLeadIds(ids);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedLeadIds.length > 0) {
      onBulkDelete(selectedLeadIds);
    }
  };

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

  const columnDefs = useMemo<DataGridColumn[]>(() => [
    {
      headerName: '',
      field: 'id',
      width: 50,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: 'Name',
      field: 'name',
    },
    {
      headerName: 'Email',
      field: 'email',
    },
    {
      headerName: 'Phone',
      field: 'phone',
    },
    {
      headerName: 'Stage',
      field: 'stage',
      cellRenderer: (params) => (
        <Badge className={`${getStageColor(params.value)} text-white`}>
          {params.value || 'Unknown'}
        </Badge>
      )
    },
    {
      headerName: 'Source',
      field: 'source',
    },
    {
      headerName: 'Actions',
      field: 'actions',
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
      {selectedLeadIds.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedLeadIds.length}
          onBulkDelete={handleBulkDelete}
        />
      )}
      
      <div className="w-full rounded-md border">
        <DataGrid
          rowData={leads}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          loading={loading}
          height="500px"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default LeadGrid;
