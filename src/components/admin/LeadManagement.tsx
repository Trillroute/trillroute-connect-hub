
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lead Management</CardTitle>
        <Button 
          className="bg-music-500 hover:bg-music-600" 
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
      </CardHeader>
      <CardContent>
        <LeadTable 
          leads={leads} 
          loading={loading} 
          onEdit={openEditDialog} 
          onDelete={openDeleteDialog}
        />
      </CardContent>

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
    </Card>
  );
};

export default LeadManagement;
