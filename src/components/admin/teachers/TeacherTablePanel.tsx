import React from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { UserManagementUser } from "@/types/student";
import TeacherGrid from "./TeacherGrid";
import UserTable from "@/components/admin/users/UserTable";

interface TeacherTablePanelProps {
  teachers: UserManagementUser[];
  isLoading: boolean;
  viewMode: 'list' | 'grid' | 'tile';
  openViewDialog: (user: UserManagementUser) => void;
  openDeleteDialog: (user: UserManagementUser) => void;
  canTeacherBeDeleted: (user: UserManagementUser) => boolean;
  selectedTeachers: string[];
  setSelectedTeachers: React.Dispatch<React.SetStateAction<string[]>>;
  openEditDialog?: (user: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const TeacherTablePanel: React.FC<TeacherTablePanelProps> = ({
  teachers,
  isLoading,
  viewMode,
  openViewDialog,
  openDeleteDialog,
  canTeacherBeDeleted,
  selectedTeachers,
  setSelectedTeachers,
  openEditDialog,
  onBulkDelete
}) => {
  // Only show grid in list view mode
  if (viewMode === 'list') {
    return (
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel>
          <TeacherGrid
            teachers={teachers}
            isLoading={isLoading}
            onViewTeacher={openViewDialog}
            onEditTeacher={openEditDialog}
            onDeleteTeacher={openDeleteDialog}
            canDeleteTeacher={canTeacherBeDeleted}
            onBulkDelete={onBulkDelete}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  // For other view modes, keep using the existing UserTable component
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full">
      <ResizablePanel>
        <UserTable
          users={teachers}
          isLoading={isLoading}
          onViewUser={openViewDialog}
          onDeleteUser={openDeleteDialog}
          canDeleteUser={canTeacherBeDeleted}
          canEditUser={openEditDialog ? () => true : undefined}
          onEditUser={openEditDialog}
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
  );
};

export default TeacherTablePanel;
