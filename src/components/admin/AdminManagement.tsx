
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
import AdminGridView from '@/components/superadmin/admin/AdminGridView';
import AdminTileView from '@/components/superadmin/admin/AdminTileView';
import AccessDeniedCard from '@/components/superadmin/admin/AccessDeniedCard';
import { convertToAdminLevels } from '@/utils/permissions/typeConverters';

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
    viewMode,
    setViewMode,
    selectedIds,
    setSelectedIds,
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
    handleBulkDelete,
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
          // Convert AdminLevelDetailed[] to AdminLevel[] before updating cached roles
          updateCachedAdminRoles(convertToAdminLevels(roles));
        }
      } catch (error) {
        console.error('Error loading admin roles:', error);
      }
    };
    loadAdminRoles();
    loadAdmins();
  }, [loadAdmins]);

  if (!isSuperAdmin() && !canEditAdmin && !canDeleteAdmin) {
    return <AccessDeniedCard />;
  }

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
        {viewMode === 'list' && (
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
        )}

        {viewMode === 'grid' && (
          <AdminGridView 
            admins={admins} 
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        )}

        {viewMode === 'tile' && (
          <AdminTileView 
            admins={admins} 
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        )}
        
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
