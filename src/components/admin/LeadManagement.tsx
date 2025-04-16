
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import LeadTable from './leads/LeadTable';
import CreateLeadDialog from './leads/CreateLeadDialog';
import EditLeadDialog from './leads/EditLeadDialog';
import DeleteLeadDialog from './leads/DeleteLeadDialog';
import { useFetchLeads } from '@/hooks/useFetchLeads';
import { Lead } from '@/types/lead';

const LeadManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { leads, loading, fetchLeads } = useFetchLeads();
  
  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
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
            <Button variant="outline" onClick={fetchLeads}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <LeadTable 
          leads={leads} 
          loading={loading} 
          onEdit={openEditDialog} 
          onDelete={openDeleteDialog}
        />
        
        <CreateLeadDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
          onSuccess={fetchLeads}
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
      </CardContent>
    </Card>
  );
};

export default LeadManagement;
