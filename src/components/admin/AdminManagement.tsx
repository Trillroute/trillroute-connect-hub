
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAdminManagement } from './hooks/useAdminManagement';
import AdminTable from './admin/AdminTable';
import AdminDialogs from './admin/AdminDialogs';
import { updateCachedAdminRoles } from '@/utils/adminPermissions';
import { fetchAdminRoles } from '@/components/superadmin/AdminRoleService';
import AdminHeader from './admin/AdminHeader';
import { ViewMode } from './admin/ViewControls';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  // Bulk delete logic
  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      const admin = admins.find(a => a.id === id);
      // Only attempt delete if allowed
      if (admin && canAdminBeDeleted(admin)) {
        // Instead of passing admin object, first set it as the admin to delete, then call handleDeleteAdmin
        openDeleteDialog(admin);
        await handleDeleteAdmin(); // Call without arguments since it operates on adminToDelete state
      }
    }
    setSelectedIds([]);
    toast({
      title: 'Success',
      description: 'Selected administrators deleted.',
    });
    loadAdmins();
  };

  return (
    <Card>
      <CardHeader>
        <AdminHeader 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={loadAdmins}
          onAddAdmin={() => setIsAddDialogOpen(true)}
          selectedIds={selectedIds}
          onBulkDelete={handleBulkDelete}
          canAddAdmin={canAddAdmin}
          isSuperAdmin={isSuperAdmin()}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        <AdminTable 
          admins={admins}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onView={openViewDialog}
          viewMode={viewMode}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          canEdit={isAdminEditable}
          canDelete={canAdminBeDeleted}
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
          effectiveCanEditAdminLevel={effectiveCanEditAdminLevel || isSuperAdmin()} 
        />
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
