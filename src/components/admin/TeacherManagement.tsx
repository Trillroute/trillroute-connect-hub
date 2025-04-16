
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import UserTable from './users/UserTable';
import AddUserDialog, { NewUserData } from './users/AddUserDialog';
import DeleteUserDialog from './users/DeleteUserDialog';
import ViewUserDialog from './users/ViewUserDialog';
import { fetchAllUsers, addUser, deleteUser } from './users/UserService';
import { useAuth } from '@/hooks/useAuth';

interface TeacherManagementProps {
  canAddUser?: boolean;
  canDeleteUser?: boolean;
}

const TeacherManagement = ({ 
  canAddUser = true,
  canDeleteUser = true 
}: TeacherManagementProps) => {
  const [teachers, setTeachers] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<UserManagementUser | null>(null);
  const [teacherToView, setTeacherToView] = useState<UserManagementUser | null>(null);
  const { toast } = useToast();
  const { isAdmin, isSuperAdmin } = useAuth();

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      // Filter to only show teachers
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
      
      // Ensure we're adding a teacher
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

  const openViewDialog = (teacher: UserManagementUser) => {
    setTeacherToView(teacher);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (teacher: UserManagementUser) => {
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  const canTeacherBeDeleted = (teacher: UserManagementUser) => {
    if (!canDeleteUser) return false;
    return true; // All teachers can be deleted if permissions allow
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Teacher Management</CardTitle>
            <CardDescription>Manage teacher accounts</CardDescription>
          </div>
          <div className="flex space-x-2">
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={teachers} 
          isLoading={isLoading}
          onViewUser={openViewDialog}
          onDeleteUser={openDeleteDialog}
          canDeleteUser={canTeacherBeDeleted}
          roleFilter="teacher"
        />
        
        <AddUserDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddUser={handleAddTeacher}
          isLoading={isLoading}
          allowAdminCreation={false}
          defaultRole="teacher"
          title="Add Teacher"
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
        />
      </CardContent>
    </Card>
  );
};

export default TeacherManagement;
