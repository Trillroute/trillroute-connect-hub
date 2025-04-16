
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Filter, ArrowUpDown, Pencil } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if user is superadmin and override permissions
  const isSuperAdmin = user?.role === 'superadmin';
  const effectiveCanAddLead = isSuperAdmin ? true : canAddLead;
  const effectiveCanEditLead = isSuperAdmin ? true : canEditLead;
  const effectiveCanDeleteLead = isSuperAdmin ? true : canDeleteLead;
  
  const openEditDialog = (lead: Lead) => {
    // Always allow superadmin to edit leads
    if (isSuperAdmin) {
      setSelectedLead(lead);
      setIsEditDialogOpen(true);
      return;
    }
    
    // Only allow opening the edit dialog if the user has edit permissions
    if (!effectiveCanEditLead) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit leads.",
        variant: "destructive",
      });
      return;
    }
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
    // Always allow superadmin to delete leads
    if (isSuperAdmin) {
      setSelectedLead(lead);
      setIsDeleteDialogOpen(true);
      return;
    }
    
    // Only allow opening the delete dialog if the user has delete permissions
    if (!effectiveCanDeleteLead) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete leads.",
        variant: "destructive",
      });
      return;
    }
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Lead Management</CardTitle>
            <CardDescription>Manage prospective students</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={fetchLeads}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {effectiveCanAddLead && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-auto flex-1">
            <Input
              type="search"
              placeholder="Search leads..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" /> 
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" /> 
              Sort
            </Button>
          </div>
        </div>
        
        <LeadTable 
          leads={leads} 
          loading={loading} 
          onEdit={openEditDialog}
          onDelete={effectiveCanDeleteLead ? openDeleteDialog : undefined}
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
            
            {effectiveCanDeleteLead && (
              <DeleteLeadDialog 
                open={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen} 
                lead={selectedLead}
                onSuccess={fetchLeads}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadManagement;
