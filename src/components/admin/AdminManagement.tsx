
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, LayoutList, LayoutGrid, Grid2x2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import { useAuth } from '@/hooks/useAuth';
import { useAdminManagement } from './hooks/useAdminManagement';
import AdminTable from './admin/AdminTable';
import AdminDialogs from './admin/AdminDialogs';
import { updateCachedAdminRoles } from '@/utils/adminPermissions';
import { fetchAdminRoles } from '@/components/superadmin/AdminRoleService';

const VIEW_MODES = ['list', 'grid', 'tile'] as const;
type ViewMode = typeof VIEW_MODES[number];

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

  const allAdminIds = admins.map(admin => admin.id);
  const allSelected = selectedIds.length > 0 && allAdminIds.length > 0 && allAdminIds.every(id => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  // Bulk delete logic
  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      const admin = admins.find(a => a.id === id);
      // Only attempt delete if allowed
      if (admin && canAdminBeDeleted(admin)) {
        await handleDeleteAdmin({ id }); // this function might take an object or just id, adjust as needed
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            <CardTitle>Administrator Management</CardTitle>
            <CardDescription>Manage administrator accounts</CardDescription>
          </div>
          <div className="flex flex-wrap space-x-2 items-center">
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
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="ml-2"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedIds.length})
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
          viewMode={viewMode}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
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

