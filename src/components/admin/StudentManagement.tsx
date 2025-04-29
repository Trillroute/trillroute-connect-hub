
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useStudentManagement } from './students/hooks/useStudentManagement';
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
  const { isSuperAdmin } = useAuth();
  const studentManagement = useStudentManagement(canAddUser, canEditUser, canDeleteUser);

  return (
    <Card>
      <CardHeader>
        <StudentHeaderControls
          viewMode={studentManagement.viewMode}
          setViewMode={studentManagement.setViewMode}
          onRefresh={studentManagement.loadStudents}
          canAddUser={canAddUser}
          onAdd={() => studentManagement.setIsAddDialogOpen(true)}
          selectedCount={studentManagement.selectedStudents.length}
          onBulkDelete={() => {
            if (studentManagement.selectedStudents.length > 0) {
              studentManagement.bulkDeleteStudents(studentManagement.selectedStudents);
            }
          }}
          isLoading={studentManagement.isLoading}
        />
      </CardHeader>
      <CardContent>
        <StudentTablePanel
          students={studentManagement.students}
          isLoading={studentManagement.isLoading}
          viewMode={studentManagement.viewMode}
          openViewDialog={studentManagement.openViewDialog}
          openDeleteDialog={studentManagement.openDeleteDialog}
          canStudentBeDeleted={studentManagement.canStudentBeDeleted}
          selectedStudents={studentManagement.selectedStudents}
          setSelectedStudents={studentManagement.setSelectedStudents}
          openEditDialog={canEditUser ? studentManagement.openEditDialog : undefined}
        />
        <StudentDialogs
          isAddDialogOpen={studentManagement.isAddDialogOpen}
          setIsAddDialogOpen={studentManagement.setIsAddDialogOpen}
          handleAddStudent={studentManagement.handleAddStudent}
          isEditDialogOpen={studentManagement.isEditDialogOpen}
          setIsEditDialogOpen={studentManagement.setIsEditDialogOpen}
          handleUpdateStudent={studentManagement.handleUpdateStudent}
          isDeleteDialogOpen={studentManagement.isDeleteDialogOpen}
          setIsDeleteDialogOpen={studentManagement.setIsDeleteDialogOpen}
          handleDeleteStudent={studentManagement.handleDeleteStudent}
          isViewDialogOpen={studentManagement.isViewDialogOpen}
          setIsViewDialogOpen={studentManagement.setIsViewDialogOpen}
          studentToEdit={studentManagement.studentToEdit}
          studentToDelete={studentManagement.studentToDelete}
          studentToView={studentManagement.studentToView}
          handleEditFromView={studentManagement.handleEditFromView}
          handleDeleteFromView={studentManagement.handleDeleteFromView}
          isLoading={studentManagement.isLoading}
          canEditUser={canEditUser}
          canDeleteUser={canDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default StudentManagement;
