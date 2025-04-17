
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import { useAuth } from '@/hooks/useAuth';
import { useAdminManagement } from './hooks/useAdminManagement';
import AdminTable from './admin/AdminTable';
import AdminDialogs from './admin/AdminDialogs';
import { updateCachedAdminRoles } from '@/utils/adminPermissions';
import { fetchAdminRoles } from '@/components/superadmin/AdminRoleService';

interface AdminManagementProps {
  canAddAdmin?: boolean;
  canEditAdmin?: boolean;
  canDeleteAdmin?: boolean;
  canEditAdminLevel?: boolean;
}

const AdminManagement = ({ 
  canAddAdmin = false,
  canEditAdmin = false,
  canDeleteAdmin = false,
  canEditAdminLevel = false
}: AdminManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isSuperAdmin } = useAuth();
  
  const {
    admins,
    isLoading,
    adminToEdit,
    adminToDelete,
    adminToView,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    loadAdmins,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDialogOpen,
    handleAddAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleUpdateAdminLevel,
    openEditDialog,
    openViewDialog,
    openDeleteDialog,
    isAdminEditable,
    canAdminBeDeleted,
    effectiveCanEditAdminLevel
  } = useAdminManagement({
    canEditAdmin,
    canDeleteAdmin,
    canEditAdminLevel,
    toast
  });

  // Load admin roles for permission checks when component mounts
  useEffect(() => {
    const loadAdminRoles = async () => {
      try {
        const roles = await fetchAdminRoles();
        if (roles && roles.length > 0) {
          updateCachedAdminRoles(roles);
        }
      } catch (error) {
        console.error('Error loading admin roles:', error);
      }
    };
    
    loadAdminRoles();
    loadAdmins();
  }, [loadAdmins]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Administrator Management</CardTitle>
            <CardDescription>Manage administrator accounts</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={loadAdmins}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {(canAddAdmin || isSuperAdmin()) && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Administrator
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AdminTable 
          admins={admins} 
          isLoading={isLoading}
          onViewAdmin={openViewDialog}
          onEditAdmin={openEditDialog}
          onDeleteAdmin={openDeleteDialog}
          canDeleteAdmin={canAdminBeDeleted}
          canEditAdmin={isAdminEditable}
        />
        
        <AdminDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          isViewDialogOpen={isViewDialogOpen}
          setIsViewDialogOpen={setIsViewDialogOpen}
          adminToEdit={adminToEdit}
          adminToDelete={adminToDelete}
          adminToView={adminToView}
          handleAddAdmin={handleAddAdmin}
          handleUpdateAdmin={handleUpdateAdmin}
          handleDeleteAdmin={handleDeleteAdmin}
          handleUpdateAdminLevel={handleUpdateAdminLevel}
          isLoading={isLoading}
          canAddAdmin={canAddAdmin}
          effectiveCanEditAdminLevel={effectiveCanEditAdminLevel}
        />
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
