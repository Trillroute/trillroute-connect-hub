
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SuperAdminSidebar, { ActiveTab } from "@/components/admin/SuperAdminSidebar";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardData } from '@/components/superadmin/hooks/useDashboardData';
import { useFetchLeads } from "@/hooks/useFetchLeads";
import EditLeadDialog from "@/components/admin/leads/EditLeadDialog";
import DeleteLeadDialog from "@/components/admin/leads/DeleteLeadDialog";
import DashboardContent from '@/components/superadmin/dashboard/DashboardContent';
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { Lead } from "@/types/lead";

const SuperAdminDashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const { logActivity } = useActivityLogger();
  const { toast } = useToast();

  // Dashboard data for statistics and charts - now with improved caching
  const {
    stats,
    userActivityData,
    currentYear,
    loading,
    handleYearChange,
    refreshData
  } = useDashboardData();

  // Leads data for leads management
  const fetchLeadsResult = useFetchLeads();
  const leads = fetchLeadsResult?.leads || [];
  const leadsLoading = fetchLeadsResult?.loading || false;
  const fetchLeads = fetchLeadsResult?.fetchLeads || (() => {
    console.log('Fetch leads function not available');
  });
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle tab changes and log the activity
  const handleTabChange = (tab: ActiveTab) => {
    console.log("Tab changing from", activeTab, "to", tab);
    setActiveTab(tab);
    if (user) {
      logActivity({
        userId: user.id,
        action: "CLICK_TAB",
        component: `Tab: ${tab}`,
        pageUrl: window.location.pathname
      });
    }
  };

  // Dialog handlers for lead management
  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  // Permission check
  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="p-8">
          <h3 className="text-lg font-medium">Permission Denied</h3>
          <p className="text-gray-500">You don't have permission to manage administrators.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen flex flex-row bg-background w-full">
      <SuperAdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 flex flex-col">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
              <p className="text-gray-500">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Module'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-auto p-4 md:p-6">
          <DashboardContent
            activeTab={activeTab}
            stats={stats}
            userActivityData={userActivityData}
            currentYear={currentYear}
            handleYearChange={handleYearChange}
            leads={leads}
            leadsLoading={leadsLoading}
            onEditLead={openEditDialog}
            onDeleteLead={openDeleteDialog}
          />

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
  );
};

export default SuperAdminDashboard;
