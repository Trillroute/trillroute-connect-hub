
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Search, LayoutGrid, Grid2x2, LayoutList, Pencil, Trash2, Kanban } from 'lucide-react';
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
import LeadKanbanBoard from './leads/LeadKanbanBoard';
import { useLeadToastAdapter } from './leads/hooks/useLeadToastAdapter';

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
  const { showToast, showSuccessToast, showErrorToast } = useLeadToastAdapter();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const fetchLeadsResult = useFetchLeads();
  const leads = fetchLeadsResult?.leads || [];
  const loading = fetchLeadsResult?.loading || false;
  const fetchLeads = fetchLeadsResult?.fetchLeads || (() => {
    console.log('Fetch leads function not available');
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile' | 'cards'>('list');

  const isSuperAdmin = user?.role === 'superadmin';
  const effectiveCanAddLead = isSuperAdmin ? true : canAddLead;
  const effectiveCanEditLead = isSuperAdmin ? true : canEditLead;
  const effectiveCanDeleteLead = isSuperAdmin ? true : canDeleteLead;

  console.log('LeadManagement - User:', user);
  console.log('LeadManagement - isSuperAdmin:', isSuperAdmin);
  console.log('LeadManagement - effectiveCanEditLead:', effectiveCanEditLead);
  console.log('LeadManagement - admin role name:', user?.adminRoleName);
  
  // Fix argument count error by checking user's role first
  const canEditLeadsPermission = user?.role === 'admin' ? canManageLeads(user) : 'N/A';
  console.log('LeadManagement - can edit leads permission:', canEditLeadsPermission);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLeads(leads || []);
      return;
    }
    
    const leadsArray = Array.isArray(leads) ? leads : [];
    
    const filtered = leadsArray.filter(lead => {
      const query = searchQuery.toLowerCase();
      return (
        (lead.name || '').toLowerCase().includes(query) ||
        (lead.email || '').toLowerCase().includes(query) ||
        (lead.phone && lead.phone.toLowerCase().includes(query)) ||
        (lead.stage && lead.stage.toLowerCase().includes(query)) ||
        (lead.source && lead.source.toLowerCase().includes(query))
      );
    });
    
    setFilteredLeads(filtered);
  }, [leads, searchQuery]);
  
  const openEditDialog = (lead: Lead) => {
    if (isSuperAdmin) {
      console.log('LeadManagement - Superadmin opening edit dialog');
      setSelectedLead(lead);
      setIsEditDialogOpen(true);
      return;
    }
    
    if (user?.role === 'admin') {
      // Fix: Remove parameters from canManageLeads call
      const hasPermission = canManageLeads(user);
      console.log('LeadManagement - Admin has edit permission:', hasPermission);
      
      if (!hasPermission) {
        showToast("Permission Denied", "You don't have permission to edit leads.");
        return;
      }
    }
    
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
    if (isSuperAdmin) {
      console.log('LeadManagement - Superadmin opening delete dialog');
      setSelectedLead(lead);
      setIsDeleteDialogOpen(true);
      return;
    }
    
    if (user?.role === 'admin') {
      // Fix: Remove parameters from canManageLeads call
      const hasPermission = canManageLeads(user);
      console.log('LeadManagement - Admin has delete permission:', hasPermission);
      
      if (!hasPermission) {
        showToast("Permission Denied", "You don't have permission to delete leads.");
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
          <div className="flex flex-row gap-2 items-center">
            <Button 
              size="sm" 
              variant={viewMode === 'list' ? "secondary" : "outline"}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'grid' ? "secondary" : "outline"}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'tile' ? "secondary" : "outline"}
              onClick={() => setViewMode('tile')}
              title="Tile view"
            >
              <Grid2x2 className="w-4 h-4" />
            </Button>
            <Button 
              size="sm"
              variant={viewMode === 'cards' ? "secondary" : "outline"}
              onClick={() => setViewMode('cards')}
              title="Cards (Kanban) view"
            >
              <span className="sr-only">Cards View</span>
              <span>
                <Kanban className="w-4 h-4" />
              </span>
            </Button>
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
        
        {viewMode === 'list' && (
          <LeadTable 
            leads={filteredLeads} 
            loading={loading} 
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        )}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLeads.map(lead => (
              <div key={lead.id} className="bg-muted rounded-lg shadow-sm p-4 flex flex-col">
                <div className="font-semibold">{lead.name}</div>
                <div className="text-sm text-gray-500">{lead.email}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditDialog(lead)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(lead)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {viewMode === 'tile' && (
          <div className="flex flex-wrap gap-4">
            {filteredLeads.map(lead => (
              <div key={lead.id} className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center">
                <div className="font-semibold">{lead.name}</div>
                <div className="text-xs text-gray-500">{lead.email}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditDialog(lead)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(lead)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {viewMode === 'cards' && (
          <LeadKanbanBoard
            leads={filteredLeads}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        )}

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
