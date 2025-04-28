
import React from 'react';
import { Lead } from '@/types/lead';
import DataTable from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table/types';
import { Badge } from '@/components/ui/badge';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  onEdit,
  onDelete
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

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Name',
      filterable: true,
    },
    {
      key: 'email',
      label: 'Email',
      filterable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      filterable: true,
    },
    {
      key: 'stage',
      label: 'Stage',
      filterable: true,
      render: (value) => (
        <Badge className={`${getStageColor(value)} text-white`}>
          {value || 'Unknown'}
        </Badge>
      )
    },
    {
      key: 'source',
      label: 'Source',
      filterable: true,
    }
  ];

  return (
    <DataTable
      data={leads}
      columns={columns}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default LeadTable;
