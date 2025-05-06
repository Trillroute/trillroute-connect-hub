
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { UserManagementUser } from '@/types/student';

interface AdminManagementProps {
  canAddAdmin?: boolean;
  canEditAdmin?: boolean;
  canDeleteAdmin?: boolean;
  canEditAdminLevel?: boolean;
}

const AdminManagement: React.FC<AdminManagementProps> = ({
  canAddAdmin = true,
  canEditAdmin = true,
  canDeleteAdmin = true,
  canEditAdminLevel = true
}) => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<UserManagementUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState<UserManagementUser[]>([]);

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
        admin.firstName.toLowerCase().includes(query) ||
        admin.lastName.toLowerCase().includes(query) ||
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

      // Transform the data to match UserManagementUser structure
      const transformedData = data.map((admin: any) => ({
        id: admin.id,
        firstName: admin.first_name,
        lastName: admin.last_name,
        email: admin.email,
        role: admin.role,
        roleName: admin.admin_level_name,
        createdAt: admin.created_at,
      }));

      setAdmins(transformedData);
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

  const openEditDialog = (admin: UserManagementUser) => {
    setSelectedAdmin(admin);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (admin: UserManagementUser) => {
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
        
        {/* Use the admin/admin/AdminTable component instead of admins/AdminTable */}
        <div className="border rounded-md p-4">
          <p className="text-muted-foreground text-center py-8">Loading administrators...</p>
          <p className="text-center text-sm text-muted-foreground mb-4">
            Please check the import paths and component structure. The AdminTable component 
            is either missing or imported from the wrong location.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
