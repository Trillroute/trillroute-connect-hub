import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import { fetchAllUsers, addUser, deleteUser } from './users/UserService';
import { updateUser } from './users/UserServiceExtended';
import { useAuth } from '@/hooks/useAuth';

import StudentHeaderControls from './students/StudentHeaderControls';
import StudentTablePanel from './students/StudentTablePanel';
import StudentDialogs from './students/StudentDialogs';

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

  const handleAddStudent = async (userData: any) => {
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

  const handleUpdateStudent = async (userId: string, userData: Partial<UserManagementUser>): Promise<void> => {
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
        <StudentHeaderControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={loadStudents}
          canAddUser={canAddUser}
          onAdd={() => setIsAddDialogOpen(true)}
          selectedCount={selectedStudents.length}
          onBulkDelete={bulkDeleteStudents}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        <StudentTablePanel
          students={students}
          isLoading={isLoading}
          viewMode={viewMode}
          openViewDialog={openViewDialog}
          openDeleteDialog={openDeleteDialog}
          canStudentBeDeleted={canStudentBeDeleted}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
        />
        <StudentDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          handleAddStudent={handleAddStudent}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          handleUpdateStudent={handleUpdateStudent}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          handleDeleteStudent={handleDeleteStudent}
          isViewDialogOpen={isViewDialogOpen}
          setIsViewDialogOpen={setIsViewDialogOpen}
          studentToEdit={studentToEdit}
          studentToDelete={studentToDelete}
          studentToView={studentToView}
          handleEditFromView={handleEditFromView}
          handleDeleteFromView={handleDeleteFromView}
          isLoading={isLoading}
          canEditUser={canEditUser}
          canDeleteUser={canDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default StudentManagement;
