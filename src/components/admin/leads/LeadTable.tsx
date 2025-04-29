
import React from 'react';
import { Lead } from '@/types/lead';
import LeadGrid from './LeadGrid';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedLeadIds?: string[];
  setSelectedLeadIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
  selectedLeadIds,
  setSelectedLeadIds
}) => {
  // Always use our custom DataGrid via LeadGrid
  return (
    <LeadGrid
      leads={leads}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onBulkDelete={onBulkDelete}
      selectedLeadIds={selectedLeadIds}
      setSelectedLeadIds={setSelectedLeadIds}
    />
  );
};

export default LeadTable;
