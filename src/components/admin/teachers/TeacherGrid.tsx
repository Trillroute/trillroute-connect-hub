
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { format } from 'date-fns';
import { UserCog } from 'lucide-react';
import UnifiedDataGrid, { ColumnConfig } from '@/components/common/table/UnifiedDataGrid';

interface TeacherGridProps {
  teachers: UserManagementUser[];
  isLoading: boolean;
  onViewTeacher: (teacher: UserManagementUser) => void;
  onEditTeacher?: (teacher: UserManagementUser) => void; 
  onDeleteTeacher?: (teacher: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
  canDeleteTeacher?: (teacher: UserManagementUser) => boolean;
  selectedTeacherIds?: string[];
  setSelectedTeacherIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const TeacherGrid: React.FC<TeacherGridProps> = ({
  teachers,
  isLoading,
  onViewTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onBulkDelete,
  canDeleteTeacher = () => true,
  selectedTeacherIds = [],
  setSelectedTeacherIds
}) => {
  const columnConfigs = useMemo<ColumnConfig[]>(() => [
    {
      field: 'name',
      headerName: 'Name',
      valueGetter: ({ data }) => `${data.firstName} ${data.lastName}`,
      cellRenderer: ({ value }) => (
        <div className="font-medium flex items-center">
          <UserCog className="h-4 w-4 text-music-400 mr-1" />
          {value}
        </div>
      )
    },
    {
      field: 'email',
      headerName: 'Email'
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      valueFormatter: ({ value }) => {
        if (!value) return '';
        try {
          return format(new Date(value), 'MMM d, yyyy');
        } catch (error) {
          console.error('Date formatting error:', error);
          return value;
        }
      }
    }
  ], []);

  // Filter out teachers that can't be deleted for the action buttons
  const handleDelete = onDeleteTeacher 
    ? (teacher: UserManagementUser) => {
        if (canDeleteTeacher(teacher)) {
          onDeleteTeacher(teacher);
        }
      }
    : undefined;

  return (
    <UnifiedDataGrid
      data={teachers}
      columnConfigs={columnConfigs}
      loading={isLoading}
      onEdit={onEditTeacher}
      onDelete={handleDelete}
      onView={onViewTeacher}
      onBulkDelete={onBulkDelete}
      selectedIds={selectedTeacherIds}
      setSelectedIds={setSelectedTeacherIds}
      emptyMessage="No teachers found"
    />
  );
};

export default TeacherGrid;
