
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
import { AdminLevelDetailed } from '@/types/adminLevel';
import LevelTable from './LevelTable';
import CreateLevelDialog from './CreateLevelDialog';
import EditLevelDialog from './EditLevelDialog';
import DeleteLevelDialog from './DeleteLevelDialog';
import ViewPermissionsDialog from './ViewPermissionsDialog';
import PermissionsDialog from './PermissionsDialog';
import { fetchLevels, addLevel, updateLevel, deleteLevel } from './LevelService';
import { updateCachedAdminRoles } from '@/utils/adminPermissions';
import { useAuth } from '@/hooks/useAuth';

interface LevelManagementProps {
  canAddLevel?: boolean;
  canEditLevel?: boolean;
  canDeleteLevel?: boolean;
}

const LevelManagement = ({
  canAddLevel = true,
  canEditLevel = true,
  canDeleteLevel = true,
}: LevelManagementProps) => {
  const [levels, setLevels] = useState<AdminLevelDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewPermissionsDialogOpen, setIsViewPermissionsDialogOpen] = useState(false);
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<AdminLevelDetailed | null>(null);
  const { toast } = useToast();
  const { isSuperAdmin } = useAuth();

  const loadLevels = async () => {
    try {
      setIsLoading(true);
      const levelsData = await fetchLevels();
      setLevels(levelsData);
      
      // Update the cached admin roles for permission checks
      updateCachedAdminRoles(levelsData);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch admin levels. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLevels();
  }, []);

  const handleCreateLevel = async (levelData: Omit<AdminLevelDetailed, 'id'>) => {
    try {
      setIsLoading(true);
      await addLevel(levelData);

      toast({
        title: 'Success',
        description: 'Admin level created successfully.',
      });
      
      setIsCreateDialogOpen(false);
      loadLevels();
    } catch (error: any) {
      console.error('Error creating level:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create admin level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLevel = async (id: number, levelData: Partial<AdminLevelDetailed>) => {
    try {
      setIsLoading(true);
      await updateLevel(id, levelData);

      toast({
        title: 'Success',
        description: 'Admin level updated successfully.',
      });
      
      setIsEditDialogOpen(false);
      setIsEditPermissionsDialogOpen(false);
      setSelectedLevel(null);
      loadLevels();
    } catch (error: any) {
      console.error('Error updating level:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update admin level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLevel = async () => {
    if (!selectedLevel) return;
    
    try {
      setIsLoading(true);
      await deleteLevel(selectedLevel.id);

      toast({
        title: 'Success',
        description: 'Admin level deleted successfully.',
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedLevel(null);
      loadLevels();
    } catch (error: any) {
      console.error('Error deleting level:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete admin level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsDeleteDialogOpen(true);
  };

  const openViewPermissionsDialog = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsViewPermissionsDialogOpen(true);
  };

  const openEditPermissionsDialog = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsEditPermissionsDialogOpen(true);
  };

  // Only superadmins can fully manage admin levels
  const effectiveCanAdd = canAddLevel && isSuperAdmin();
  const effectiveCanEdit = canEditLevel && isSuperAdmin();
  const effectiveCanDelete = canDeleteLevel && isSuperAdmin();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Level Management</CardTitle>
            <CardDescription>Manage permission levels</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={loadLevels}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {effectiveCanAdd && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Level
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <LevelTable 
          levels={levels} 
          isLoading={isLoading}
          onEditLevel={(level) => {
            if (effectiveCanEdit) {
              openEditPermissionsDialog(level);
            } else {
              openViewPermissionsDialog(level);
            }
          }}
          onDeleteLevel={openDeleteDialog}
          onViewPermissions={openViewPermissionsDialog}
        />
        
        <CreateLevelDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateLevel={handleCreateLevel}
          isLoading={isLoading}
        />
        
        <EditLevelDialog
          level={selectedLevel}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateLevel={handleUpdateLevel}
          isLoading={isLoading}
        />
        
        <DeleteLevelDialog
          level={selectedLevel}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteLevel}
          isLoading={isLoading}
        />
        
        <ViewPermissionsDialog
          level={selectedLevel}
          isOpen={isViewPermissionsDialogOpen}
          onOpenChange={setIsViewPermissionsDialogOpen}
        />
        
        <PermissionsDialog
          level={selectedLevel}
          isOpen={isEditPermissionsDialogOpen}
          onOpenChange={setIsEditPermissionsDialogOpen}
          onUpdatePermissions={handleUpdateLevel}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default LevelManagement;
