
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

interface StudentManagementProps {
  canAddUser?: boolean;
  canDeleteUser?: boolean;
}

const StudentManagement = ({ 
  canAddUser = true,
  canDeleteUser = true 
}: StudentManagementProps) => {
  const [students, setStudents] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<UserManagementUser | null>(null);
  const [studentToView, setStudentToView] = useState<UserManagementUser | null>(null);
  const { toast } = useToast();
  const { isAdmin, isSuperAdmin } = useAuth();

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      // Filter to only show students
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
      
      // Ensure we're adding a student
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

  const openViewDialog = (student: UserManagementUser) => {
    setStudentToView(student);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (student: UserManagementUser) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const canStudentBeDeleted = (student: UserManagementUser) => {
    if (!canDeleteUser) return false;
    return true; // All students can be deleted if permissions allow
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Manage student accounts</CardDescription>
          </div>
          <div className="flex space-x-2">
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={students} 
          isLoading={isLoading}
          onViewUser={openViewDialog}
          onDeleteUser={openDeleteDialog}
          canDeleteUser={canStudentBeDeleted}
          roleFilter="student"
        />
        
        <AddUserDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddUser={handleAddStudent}
          isLoading={isLoading}
          allowAdminCreation={false}
          defaultRole="student"
          title="Add Student"
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
        />
      </CardContent>
    </Card>
  );
};

export default StudentManagement;
