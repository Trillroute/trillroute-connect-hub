import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AdminTable from './admins/AdminTable';
import CreateAdminDialog from './admins/CreateAdminDialog';
import EditAdminDialog from './admins/EditAdminDialog';
import DeleteAdminDialog from './admins/DeleteAdminDialog';
import { Admin } from '@/types/admin';
import { Input } from '@/components/ui/input';

const AdminManagement: React.FC = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAdmins(admins);
      return;
    }

    const filtered = admins.filter(admin => {
      const query = searchQuery.toLowerCase();
      return (
        admin.first_name.toLowerCase().includes(query) ||
        admin.last_name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        (admin.roleName && admin.roleName.toLowerCase().includes(query))
      );
    });

    setFilteredAdmins(filtered);
  }, [admins, searchQuery]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAdmins(data as Admin[]);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admins. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
  };

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
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle>Admin Management</CardTitle>
            <CardDescription>Manage administrators</CardDescription>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button
              variant="outline"
              onClick={fetchAdmins}
              className="flex items-center gap-2"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary text-white flex items-center gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add Admin
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-md mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search admins..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <AdminTable
          admins={filteredAdmins}
          loading={loading}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          canEdit={() => isSuperAdmin()}
          canDelete={(user) => isSuperAdmin()}
        />
        <CreateAdminDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={fetchAdmins}
        />
        {selectedAdmin && (
          <>
            <EditAdminDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              admin={selectedAdmin}
              onSuccess={fetchAdmins}
            />
            <DeleteAdminDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              admin={selectedAdmin}
              onSuccess={fetchAdmins}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
