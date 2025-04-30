
import React from 'react';
import { ClassType } from '@/hooks/useClassTypes';
import ClassTypeGrid from './ClassTypeGrid';

// Re-export using 'export type' for TypeScript isolated modules
export type { ClassType };

interface ClassTypeTableProps {
  classTypes: ClassType[];
  isLoading: boolean;
  onEdit: (classType: ClassType) => void;
  onDelete: (classType: ClassType) => void;
  onView: (classType: ClassType) => void;
  selectedIds?: string[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  onBulkDelete?: (ids: string[]) => void;
}

const ClassTypeTable: React.FC<ClassTypeTableProps> = ({
  classTypes,
  isLoading,
  onEdit,
  onDelete,
  onView,
  selectedIds,
  setSelectedIds,
  onBulkDelete
}) => {
  return (
    <ClassTypeGrid
      classTypes={classTypes}
      loading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onBulkDelete={onBulkDelete}
      selectedClassTypeIds={selectedIds}
      setSelectedClassTypeIds={setSelectedIds}
    />
  );
};

export default ClassTypeTable;
