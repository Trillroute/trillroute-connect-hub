
import React from 'react';
import { Lead } from '@/types/lead';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type StatusColumn = {
  key: string;
  label: string;
};

const STATUS_COLUMNS: StatusColumn[] = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'converted', label: 'Converted' },
  { key: 'lost', label: 'Lost' },
];

interface LeadKanbanBoardProps {
  leads: Lead[];
  loading: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
}

const LeadKanbanBoard: React.FC<LeadKanbanBoardProps> = ({
  leads, loading, onEdit, onDelete
}) => {
  if (loading) {
    return (
      <div className="flex w-full gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map(column => (
          <div key={column.key} className="min-w-[270px] flex-1">
            <Card className="bg-muted/40 border-0 shadow-none">
              <CardTitle className="text-center py-2 font-semibold text-base">{column.label}</CardTitle>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  // Normalize status values to lowercase for consistency
  const normalizedLeads = leads.map(lead => ({
    ...lead,
    status: lead.status ? lead.status.toLowerCase() : 'new'
  }));

  // Bucket leads by status, leave empty arrays for missing statuses
  const leadsByStatus: { [status: string]: Lead[] } = {};
  STATUS_COLUMNS.forEach(s => leadsByStatus[s.key] = []);
  
  normalizedLeads.forEach(lead => {
    const statusKey = STATUS_COLUMNS.some(col => col.key === lead.status) 
      ? lead.status 
      : 'new';
      
    if (leadsByStatus[statusKey]) {
      leadsByStatus[statusKey].push(lead);
    } else {
      leadsByStatus['new'].push(lead);
    }
  });

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-4">
      {STATUS_COLUMNS.map(column => (
        <div key={column.key} className="min-w-[270px] flex-1">
          <Card className="bg-muted/40 border-0 shadow-none">
            <CardTitle className="text-center py-2 font-semibold text-base">{column.label}</CardTitle>
            <CardContent>
              <div className="flex flex-col gap-3">
                {leadsByStatus[column.key].length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4">No leads</div>
                )}
                {leadsByStatus[column.key].map(lead => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-lg shadow border p-3 flex flex-col gap-2 hover:shadow-md animate-fade-in"
                  >
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.email}</div>
                    {lead.phone && (
                      <div className="text-xs text-gray-500">{lead.phone}</div>
                    )}
                    <div className="flex justify-between items-center mt-2 gap-2">
                      <span className="text-gray-400 text-xs">{lead.source || 'Unspecified'}</span>
                      <div className="flex space-x-1">
                        {onEdit && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onEdit(lead)}
                            className="rounded-full group"
                          >
                            <Pencil className="w-4 h-4 group-hover:text-primary" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(lead)}
                            className="rounded-full group"
                          >
                            <Trash2 className="w-4 h-4 group-hover:text-red-600" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default LeadKanbanBoard;
