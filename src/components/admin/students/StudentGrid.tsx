
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { format } from 'date-fns';
import { User } from 'lucide-react';
import UnifiedDataGrid, { ColumnConfig } from '@/components/common/table/UnifiedDataGrid';

interface StudentGridProps {
  students: UserManagementUser[];
  isLoading: boolean;
  onViewStudent: (student: UserManagementUser) => void;
  onEditStudent?: (student: UserManagementUser) => void; 
  onDeleteStudent?: (student: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
  canDeleteStudent?: (student: UserManagementUser) => boolean;
  selectedStudentIds?: string[];
  setSelectedStudentIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const StudentGrid: React.FC<StudentGridProps> = ({
  students,
  isLoading,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onBulkDelete,
  canDeleteStudent = () => true,
  selectedStudentIds = [],
  setSelectedStudentIds
}) => {
  const columnConfigs = useMemo<ColumnConfig[]>(() => [
    {
      field: 'name',
      headerName: 'Name',
      valueGetter: ({ data }) => {
        return data ? `${data.firstName || ''} ${data.lastName || ''}` : '';
      },
      cellRenderer: ({ value }) => {
        if (!value) return null;
        return (
          <div className="font-semibold flex items-center">
            <User className="h-4 w-4 text-blue-500 mr-1" />
            {value}
          </div>
        );
      }
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

  // Filter out students that can't be deleted for the action buttons
  const handleDelete = onDeleteStudent 
    ? (student: UserManagementUser) => {
        if (canDeleteStudent(student)) {
          onDeleteStudent(student);
        }
      }
    : undefined;

  return (
    <UnifiedDataGrid
      data={students || []}
      columnConfigs={columnConfigs}
      loading={isLoading}
      onEdit={onEditStudent}
      onDelete={handleDelete}
      onView={onViewStudent}
      onBulkDelete={onBulkDelete}
      selectedIds={selectedStudentIds}
      setSelectedIds={setSelectedStudentIds}
      emptyMessage="No students found"
    />
  );
};

export default StudentGrid;
