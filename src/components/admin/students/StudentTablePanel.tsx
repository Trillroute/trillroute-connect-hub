
import React from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { UserManagementUser } from "@/types/student";
import StudentGrid from "./StudentGrid";
import UserTable from "@/components/admin/users/UserTable";

interface StudentTablePanelProps {
  students: UserManagementUser[];
  isLoading: boolean;
  viewMode: 'list' | 'grid' | 'tile';
  openViewDialog: (user: UserManagementUser) => void;
  openDeleteDialog: (user: UserManagementUser) => void;
  canStudentBeDeleted: (user: UserManagementUser) => boolean;
  selectedStudents: string[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<string[]>>;
}

const StudentTablePanel: React.FC<StudentTablePanelProps> = ({
  students,
  isLoading,
  viewMode,
  openViewDialog,
  openDeleteDialog,
  canStudentBeDeleted,
  selectedStudents,
  setSelectedStudents
}) => {
  // Only show grid in list view mode
  if (viewMode === 'list') {
    return (
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel>
          <StudentGrid
            students={students}
            isLoading={isLoading}
            onViewStudent={openViewDialog}
            onDeleteStudent={openDeleteDialog}
            canDeleteStudent={canStudentBeDeleted}
            onBulkDelete={(ids) => setSelectedStudents([])}
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
  );
};

export default StudentTablePanel;
