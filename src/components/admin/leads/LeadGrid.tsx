
import React, { useMemo } from 'react';
import { Lead } from '@/types/lead';
import { Badge } from '@/components/ui/badge';
import UnifiedDataGrid, { ColumnConfig } from '@/components/common/table/UnifiedDataGrid';

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

  const columnConfigs = useMemo<ColumnConfig[]>(() => [
    {
      field: 'name',
      headerName: 'Name'
    },
    {
      field: 'email',
      headerName: 'Email'
    },
    {
      field: 'phone',
      headerName: 'Phone'
    },
    {
      field: 'stage',
      headerName: 'Stage',
      cellRenderer: ({ value }) => (
        <Badge className={`${getStageColor(value)} text-white`}>
          {value || 'Unknown'}
        </Badge>
      )
    },
    {
      field: 'source',
      headerName: 'Source'
    }
  ], []);

  return (
    <UnifiedDataGrid
      data={leads}
      columnConfigs={columnConfigs}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onBulkDelete={onBulkDelete}
      selectedIds={selectedLeadIds}
      setSelectedIds={setSelectedLeadIds}
      emptyMessage="No leads found"
    />
  );
};

export default LeadGrid;
