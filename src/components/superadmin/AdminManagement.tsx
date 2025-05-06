
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAdminManagement } from './hooks/useAdminManagement';
import { useAuth } from '@/hooks/useAuth';
import AdminTable from './AdminTable';
import DeleteAdminDialog from './DeleteAdminDialog';
import EditUserDialog from '../admin/users/EditUserDialog';
import AdminHeader from './admin/AdminHeader';
import AdminGridView from './admin/AdminGridView';
import AdminTileView from './admin/AdminTileView';
import AccessDeniedCard from './admin/AccessDeniedCard';

const AdminManagement: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const {
    admins,
    isLoading,
    viewMode,
    setViewMode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    adminToDelete,
    userToEdit,
    loadAdmins,
    handleUpdateUserDetails,
    handleUpdateAdminLevel,
    handleDeleteAdmin,
    openEditUserDialog,
    openDeleteDialog
  } = useAdminManagement();

  if (!isSuperAdmin()) {
    return <AccessDeniedCard />;
  }

  return (
    <Card>
      <CardHeader>
        <AdminHeader 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={loadAdmins}
        />
      </CardHeader>
      <CardContent>
        {viewMode === 'list' && (
          <AdminTable 
            admins={admins} 
            isLoading={isLoading}
            onEdit={() => {}}
            onDelete={openDeleteDialog}
            onView={openEditUserDialog}
          />
        )}

        {viewMode === 'grid' && (
          <AdminGridView 
            admins={admins} 
            onEdit={openEditUserDialog}
            onDelete={openDeleteDialog}
          />
        )}

        {viewMode === 'tile' && (
          <AdminTileView 
            admins={admins} 
            onEdit={openEditUserDialog}
            onDelete={openDeleteDialog}
          />
        )}
        
        <DeleteAdminDialog
          admin={adminToDelete}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteAdmin}
          isLoading={isLoading}
        />

        <EditUserDialog
          user={userToEdit}
          isOpen={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
          onUpdateUser={handleUpdateUserDetails}
          onUpdateLevel={handleUpdateAdminLevel}
          isLoading={isLoading}
          userRole="Administrator"
          showAdminLevelSelector={true}
        />
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
