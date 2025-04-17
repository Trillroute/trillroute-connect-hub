
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import LeadTable from './leads/LeadTable';
import CreateLeadDialog from './leads/CreateLeadDialog';
import EditLeadDialog from './leads/EditLeadDialog';
import DeleteLeadDialog from './leads/DeleteLeadDialog';
import { useFetchLeads } from '@/hooks/useFetchLeads';
import { Lead } from '@/types/lead';
import { Input } from '@/components/ui/input';
import { canManageLeads } from '@/utils/adminPermissions';

interface LeadManagementProps {
  canAddLead?: boolean;
  canEditLead?: boolean;
  canDeleteLead?: boolean;
}

const LeadManagement: React.FC<LeadManagementProps> = ({
  canAddLead = true,
  canEditLead = true,
  canDeleteLead = true
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { leads, loading, fetchLeads } = useFetchLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  
  // Check if user is superadmin and override permissions
  const isSuperAdmin = user?.role === 'superadmin';
  const effectiveCanAddLead = isSuperAdmin ? true : canAddLead;
  const effectiveCanEditLead = isSuperAdmin ? true : canEditLead;
  const effectiveCanDeleteLead = isSuperAdmin ? true : canDeleteLead;

  // Debug logging
  console.log('LeadManagement - User:', user);
  console.log('LeadManagement - isSuperAdmin:', isSuperAdmin);
  console.log('LeadManagement - effectiveCanEditLead:', effectiveCanEditLead);
  console.log('LeadManagement - admin role name:', user?.adminRoleName);
  console.log('LeadManagement - can edit leads permission:', 
    user?.role === 'admin' ? canManageLeads(user, 'edit') : 'N/A');

  // Filter leads based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLeads(leads);
      return;
    }
    
    const filtered = leads.filter(lead => {
      const query = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.phone && lead.phone.toLowerCase().includes(query)) ||
        (lead.status && lead.status.toLowerCase().includes(query)) ||
        (lead.source && lead.source.toLowerCase().includes(query))
      );
    });
    
    setFilteredLeads(filtered);
  }, [leads, searchQuery]);
  
  const openEditDialog = (lead: Lead) => {
    // Always allow superadmin to edit leads
    if (isSuperAdmin) {
      console.log('LeadManagement - Superadmin opening edit dialog');
      setSelectedLead(lead);
      setIsEditDialogOpen(true);
      return;
    }
    
    // Check if admin has edit permission
    if (user?.role === 'admin') {
      const hasPermission = canManageLeads(user, 'edit');
      console.log('LeadManagement - Admin has edit permission:', hasPermission);
      
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
    // Always allow superadmin to delete leads
    if (isSuperAdmin) {
      console.log('LeadManagement - Superadmin opening delete dialog');
      setSelectedLead(lead);
      setIsDeleteDialogOpen(true);
      return;
    }
    
    // Check if admin has delete permission
    if (user?.role === 'admin') {
      const hasPermission = canManageLeads(user, 'delete');
      console.log('LeadManagement - Admin has delete permission:', hasPermission);
      
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
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle>Lead Management</CardTitle>
            <CardDescription>Manage prospective students</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={fetchLeads}
              className="flex items-center gap-2"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {effectiveCanAddLead && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary text-white flex items-center gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-md mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <LeadTable 
          leads={filteredLeads} 
          loading={loading} 
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
        
        {effectiveCanAddLead && (
          <CreateLeadDialog 
            open={isCreateDialogOpen} 
            onOpenChange={setIsCreateDialogOpen} 
            onSuccess={fetchLeads}
          />
        )}
        
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
      </CardContent>
    </Card>
  );
};

export default LeadManagement;
