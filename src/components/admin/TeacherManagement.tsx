import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, LayoutGrid, Grid2x2, LayoutList, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import UserTable from './users/UserTable';
import AddUserDialog, { NewUserData } from './users/AddUserDialog';
import DeleteUserDialog from './users/DeleteUserDialog';
import ViewUserDialog from './users/ViewUserDialog';
import EditUserDialog from './users/EditUserDialog';
import { fetchAllUsers, addUser, deleteUser } from './users/UserService';
import { updateUser } from './users/UserServiceExtended';
import { useAuth } from '@/hooks/useAuth';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable-panel';

interface TeacherManagementProps {
  canAddUser?: boolean;
  canEditUser?: boolean;
  canDeleteUser?: boolean;
}

const TeacherManagement = ({ 
  canAddUser = true,
  canEditUser = true,
  canDeleteUser = true 
}: TeacherManagementProps) => {
  const [teachers, setTeachers] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<UserManagementUser | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<UserManagementUser | null>(null);
  const [teacherToView, setTeacherToView] = useState<UserManagementUser | null>(null);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');
  const { toast } = useToast();
  const { isAdmin, isSuperAdmin } = useAuth();

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      setTeachers(usersData.filter(user => user.role === 'teacher'));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch teachers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleAddTeacher = async (userData: NewUserData) => {
    try {
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      userData.role = 'teacher';
      
      setIsLoading(true);
      await addUser(userData);

      toast({
        title: 'Success',
        description: 'Teacher added successfully.',
      });
      
      setIsAddDialogOpen(false);
      loadTeachers();
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add teacher. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTeacher = async (userId: string, userData: Partial<UserManagementUser>) => {
    try {
      setIsLoading(true);
      await updateUser(userId, userData);

      toast({
        title: 'Success',
        description: 'Teacher updated successfully.',
      });
      
      setIsEditDialogOpen(false);
      setTeacherToEdit(null);
      loadTeachers();
    } catch (error: any) {
      console.error('Error updating teacher:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update teacher. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteUser(teacherToDelete.id);

      toast({
        title: 'Success',
        description: 'Teacher removed successfully.',
      });
      
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
      loadTeachers();
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete teacher. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDeleteTeachers = async () => {
    if (selectedTeachers.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedTeachers.length} teachers? This cannot be undone.`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedTeachers) {
        await deleteUser(id);
      }
      toast({
        title: "Success",
        description: `Deleted ${selectedTeachers.length} teachers successfully.`,
      });
      setSelectedTeachers([]);
      loadTeachers();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to bulk delete teachers.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (teacher: UserManagementUser) => {
    if (!canEditUser) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit teachers.",
        variant: "destructive",
      });
      return;
    }
    setTeacherToEdit(teacher);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (teacher: UserManagementUser) => {
    setTeacherToView(teacher);
    setIsViewDialogOpen(true);
  };

  const handleEditFromView = () => {
    if (teacherToView) {
      setIsViewDialogOpen(false);
      setTimeout(() => {
        openEditDialog(teacherToView);
      }, 200);
    }
  };

  const openDeleteDialog = (teacher: UserManagementUser) => {
    if (!canDeleteUser) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete teachers.",
        variant: "destructive",
      });
      return;
    }
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFromView = () => {
    if (teacherToView && canDeleteUser) {
      setTeacherToDelete(teacherToView);
      setIsViewDialogOpen(false);
      setTimeout(() => {
        setIsDeleteDialogOpen(true);
      }, 100);
    }
  };

  const canTeacherBeDeleted = (teacher: UserManagementUser) => {
    if (!canDeleteUser) return false;
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Teacher Management</CardTitle>
            <CardDescription>Manage teacher accounts</CardDescription>
          </div>
          <div className="flex space-x-2 items-center">
            <Button size="sm"
              variant={viewMode === 'list' ? "secondary" : "outline"}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button size="sm"
              variant={viewMode === 'grid' ? "secondary" : "outline"}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button size="sm"
              variant={viewMode === 'tile' ? "secondary" : "outline"}
              onClick={() => setViewMode('tile')}
              title="Tile view"
            >
              <Grid2x2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={loadTeachers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {canAddUser && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            )}
            {selectedTeachers.length > 0 && (
              <Button
                variant="destructive"
                onClick={bulkDeleteTeachers}
                className="ml-2"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedTeachers.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel>
            <UserTable 
              users={teachers} 
              isLoading={isLoading}
              onViewUser={openViewDialog}
              onDeleteUser={openDeleteDialog}
              canDeleteUser={canTeacherBeDeleted}
              canEditUser={undefined}
              roleFilter="teacher"
              viewMode={viewMode}
              selectedUserIds={selectedTeachers}
              onSelectUserId={id =>
                setSelectedTeachers(prev =>
                  prev.includes(id)
                    ? prev.filter(tid => tid !== id)
                    : [...prev, id]
                )
              }
              onSelectAll={ids => setSelectedTeachers(ids)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
        
        <AddUserDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddUser={handleAddTeacher}
          isLoading={isLoading}
          allowAdminCreation={false}
          defaultRole="teacher"
          title="Add Teacher"
        />

        <EditUserDialog
          user={teacherToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateUser={handleUpdateTeacher}
          isLoading={isLoading}
          userRole="Teacher"
        />
        
        <DeleteUserDialog
          user={teacherToDelete}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteTeacher}
          isLoading={isLoading}
          userRole="Teacher"
        />
        
        <ViewUserDialog
          user={teacherToView}
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          onEditFromView={canEditUser ? handleEditFromView : undefined}
          onDeleteUser={canDeleteUser ? handleDeleteFromView : undefined}
          canDeleteUser={canDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default TeacherManagement;

// NOTE: This file is getting long; consider refactoring into smaller components.
