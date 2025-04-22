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
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface StudentManagementProps {
  canAddUser?: boolean;
  canEditUser?: boolean;
  canDeleteUser?: boolean;
}

const StudentManagement = ({ 
  canAddUser = true,
  canEditUser = true,
  canDeleteUser = true 
}: StudentManagementProps) => {
  const [students, setStudents] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<UserManagementUser | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<UserManagementUser | null>(null);
  const [studentToView, setStudentToView] = useState<UserManagementUser | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');
  const { toast } = useToast();
  const { isAdmin, isSuperAdmin } = useAuth();

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      setStudents(usersData.filter(user => user.role === 'student'));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch students. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = async (userData: NewUserData) => {
    try {
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      userData.role = 'student';
      
      setIsLoading(true);
      await addUser(userData);

      toast({
        title: 'Success',
        description: 'Student added successfully.',
      });
      
      setIsAddDialogOpen(false);
      loadStudents();
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add student. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (userId: string, userData: Partial<UserManagementUser>) => {
    try {
      setIsLoading(true);
      await updateUser(userId, userData);

      toast({
        title: 'Success',
        description: 'Student updated successfully.',
      });
      
      setIsEditDialogOpen(false);
      setStudentToEdit(null);
      loadStudents();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update student. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteUser(studentToDelete.id);

      toast({
        title: 'Success',
        description: 'Student removed successfully.',
      });
      
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      loadStudents();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete student. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDeleteStudents = async () => {
    if (selectedStudents.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedStudents.length} students? This cannot be undone.`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedStudents) {
        await deleteUser(id);
      }
      toast({
        title: "Success",
        description: `Deleted ${selectedStudents.length} students successfully.`,
      });
      setSelectedStudents([]);
      loadStudents();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to bulk delete students.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (student: UserManagementUser) => {
    if (!canEditUser) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit students.",
        variant: "destructive",
      });
      return;
    }
    setStudentToEdit(student);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (student: UserManagementUser) => {
    setStudentToView(student);
    setIsViewDialogOpen(true);
  };

  const handleEditFromView = () => {
    if (studentToView) {
      setIsViewDialogOpen(false);
      setTimeout(() => {
        openEditDialog(studentToView);
      }, 200);
    }
  };

  const openDeleteDialog = (student: UserManagementUser) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFromView = () => {
    if (studentToView) {
      setStudentToDelete(studentToView);
      setIsViewDialogOpen(false);
      setTimeout(() => {
        setIsDeleteDialogOpen(true);
      }, 100);
    }
  };

  const canStudentBeDeleted = (student: UserManagementUser) => {
    if (!canDeleteUser) return false;
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Manage student accounts</CardDescription>
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
            <Button variant="outline" onClick={loadStudents}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {canAddUser && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            )}
            {selectedStudents.length > 0 && (
              <Button
                variant="destructive"
                onClick={bulkDeleteStudents}
                className="ml-2"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedStudents.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel>
            <UserTable 
              users={students} 
              isLoading={isLoading}
              onViewUser={openViewDialog}
              onDeleteUser={openDeleteDialog}
              canDeleteUser={canStudentBeDeleted}
              canEditUser={undefined}
              roleFilter="student"
              viewMode={viewMode}
              selectedUserIds={selectedStudents}
              onSelectUserId={id =>
                setSelectedStudents(prev =>
                  prev.includes(id)
                    ? prev.filter(sid => sid !== id)
                    : [...prev, id]
                )
              }
              onSelectAll={ids => setSelectedStudents(ids)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
        
        <AddUserDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddUser={handleAddStudent}
          isLoading={isLoading}
          allowAdminCreation={false}
          defaultRole="student"
          title="Add Student"
        />

        <EditUserDialog
          user={studentToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateUser={handleUpdateStudent}
          isLoading={isLoading}
          userRole="Student"
        />
        
        <DeleteUserDialog
          user={studentToDelete}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteStudent}
          isLoading={isLoading}
          userRole="Student"
        />
        
        <ViewUserDialog
          user={studentToView}
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

export default StudentManagement;
