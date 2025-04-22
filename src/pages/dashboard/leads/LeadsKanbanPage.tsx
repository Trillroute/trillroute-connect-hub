
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
import SuperAdminSidebar from "@/components/admin/SuperAdminSidebar";

const LeadsKanbanPage: React.FC = () => {
  const { leads, loading, fetchLeads } = useFetchLeads();
  const { toast } = useToast();
  const { user } = useAuth();

  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"leads-cards">("leads-cards");

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

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-row bg-background w-full">
      <SuperAdminSidebar activeTab="leads-cards" onTabChange={handleTabChange} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leads Cards</h1>
              <p className="text-muted-foreground mt-1">
                Manage your leads in a Kanban board view
              </p>
            </div>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4 md:p-6">
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
        </div>
      </div>
    </div>
  );
};

export default LeadsKanbanPage;
