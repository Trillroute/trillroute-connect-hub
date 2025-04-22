
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFetchLeads } from "@/hooks/useFetchLeads";
import LeadKanbanBoard from "@/components/admin/leads/LeadKanbanBoard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { canManageLeads } from "@/utils/adminPermissions";
import { Lead } from "@/types/lead";
import EditLeadDialog from "@/components/admin/leads/EditLeadDialog";
import DeleteLeadDialog from "@/components/admin/leads/DeleteLeadDialog";

const LeadsKanbanPage: React.FC = () => {
  const { leads, loading, fetchLeads } = useFetchLeads();
  const { toast } = useToast();
  const { user } = useAuth();

  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const isSuperAdmin = user?.role === 'superadmin';

  const openEditDialog = (lead: Lead) => {
    if (isSuperAdmin) {
      setSelectedLead(lead);
      setIsEditDialogOpen(true);
      return;
    }
    if (user?.role === 'admin') {
      const hasPermission = canManageLeads(user, 'edit');
      if (!hasPermission) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to edit leads.",
          variant: "destructive",
        });
        return;
      }
    }
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
    if (isSuperAdmin) {
      setSelectedLead(lead);
      setIsDeleteDialogOpen(true);
      return;
    }
    if (user?.role === 'admin') {
      const hasPermission = canManageLeads(user, 'delete');
      if (!hasPermission) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to delete leads.",
          variant: "destructive",
        });
        return;
      }
    }
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full pt-6">
      <Card className="shadow-none border-0">
        <CardHeader>
          <CardTitle>Leads Kanban Board</CardTitle>
          <CardDescription>
            Visualize and manage your leads in a Kanban board view.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeadKanbanBoard
            leads={leads}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>
      {selectedLead && (
        <>
          <EditLeadDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            lead={selectedLead}
            onSuccess={fetchLeads}
          />
          <DeleteLeadDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            lead={selectedLead}
            onSuccess={fetchLeads}
          />
        </>
      )}
    </div>
  );
};

export default LeadsKanbanPage;
