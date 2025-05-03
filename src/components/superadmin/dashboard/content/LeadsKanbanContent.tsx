
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import LeadKanbanBoard from "@/components/admin/leads/LeadKanbanBoard";
import { Lead } from "@/types/lead";

interface LeadsKanbanContentProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const LeadsKanbanContent: React.FC<LeadsKanbanContentProps> = ({
  leads,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="max-w-[1400px] mx-auto w-full">
      <Card className="shadow-none border-0">
        <CardHeader>
          <CardTitle>Leads Kanban Board</CardTitle>
          <CardDescription>
            Drag and drop leads between statuses to update their progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeadKanbanBoard
            leads={leads}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsKanbanContent;
