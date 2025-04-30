
import React from 'react';
import LevelGrid from './LevelGrid';
import { AdminLevelDetailed } from '@/types/adminLevel';

// Define Level interface to match AdminLevelDetailed structure
interface Level {
  id: string;
  name: string;
  description: string;
  studentPermissions?: string[];
  teacherPermissions?: string[];
  adminPermissions?: string[];
  leadPermissions?: string[];
  coursePermissions?: string[];
  levelPermissions?: string[];
}

export type { Level };

interface LevelTableProps {
  levels: Level[];
  isLoading: boolean;
  onEdit: (level: Level) => void;
  onDelete: (level: Level) => void;
  onViewPermissions: (level: Level) => void;
  selectedIds?: string[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  onBulkDelete?: (ids: string[]) => void;
}

const LevelTable: React.FC<LevelTableProps> = ({
  levels,
  isLoading,
  onEdit,
  onDelete,
  onViewPermissions,
  selectedIds,
  setSelectedIds,
  onBulkDelete
}) => {
  return (
    <LevelGrid
      levels={levels}
      loading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewPermissions={onViewPermissions}
      onBulkDelete={onBulkDelete}
      selectedLevelIds={selectedIds}
      setSelectedLevelIds={setSelectedIds}
    />
  );
};

export default LevelTable;
