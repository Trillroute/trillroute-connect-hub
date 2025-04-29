
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useTeacherManagement } from './teachers/hooks/useTeacherManagement';
import TeacherHeaderControls from './teachers/TeacherHeaderControls';
import TeacherTablePanel from './teachers/TeacherTablePanel';
import TeacherDialogs from './teachers/TeacherDialogs';

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
  const { isSuperAdmin } = useAuth();
  const teacherManagement = useTeacherManagement(canAddUser, canEditUser, canDeleteUser);

  return (
    <Card>
      <CardHeader>
        <TeacherHeaderControls
          viewMode={teacherManagement.viewMode}
          setViewMode={teacherManagement.setViewMode}
          onRefresh={teacherManagement.loadTeachers}
          canAddUser={canAddUser}
          onAdd={() => teacherManagement.setIsAddDialogOpen(true)}
          selectedCount={teacherManagement.selectedTeachers.length}
          onBulkDelete={teacherManagement.bulkDeleteTeachers}
          isLoading={teacherManagement.isLoading}
        />
      </CardHeader>
      <CardContent>
        <TeacherTablePanel
          teachers={teacherManagement.teachers}
          isLoading={teacherManagement.isLoading}
          viewMode={teacherManagement.viewMode}
          openViewDialog={teacherManagement.openViewDialog}
          openDeleteDialog={teacherManagement.openDeleteDialog}
          canTeacherBeDeleted={teacherManagement.canTeacherBeDeleted}
          selectedTeachers={teacherManagement.selectedTeachers}
          setSelectedTeachers={teacherManagement.setSelectedTeachers}
          openEditDialog={canEditUser ? teacherManagement.openEditDialog : undefined}
          onBulkDelete={teacherManagement.bulkDeleteTeachers}
        />
        <TeacherDialogs
          isAddDialogOpen={teacherManagement.isAddDialogOpen}
          setIsAddDialogOpen={teacherManagement.setIsAddDialogOpen}
          handleAddTeacher={teacherManagement.handleAddTeacher}
          isEditDialogOpen={teacherManagement.isEditDialogOpen}
          setIsEditDialogOpen={teacherManagement.setIsEditDialogOpen}
          handleUpdateTeacher={teacherManagement.handleUpdateTeacher}
          isDeleteDialogOpen={teacherManagement.isDeleteDialogOpen}
          setIsDeleteDialogOpen={teacherManagement.setIsDeleteDialogOpen}
          handleDeleteTeacher={teacherManagement.handleDeleteTeacher}
          isViewDialogOpen={teacherManagement.isViewDialogOpen}
          setIsViewDialogOpen={teacherManagement.setIsViewDialogOpen}
          teacherToEdit={teacherManagement.teacherToEdit}
          teacherToDelete={teacherManagement.teacherToDelete}
          teacherToView={teacherManagement.teacherToView}
          handleEditFromView={teacherManagement.handleEditFromView}
          handleDeleteFromView={teacherManagement.handleDeleteFromView}
          isLoading={teacherManagement.isLoading}
          canEditUser={canEditUser}
          canDeleteUser={canDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default TeacherManagement;
