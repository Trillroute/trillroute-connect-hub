
import React from 'react';
import LevelGrid from './LevelGrid';

interface Level {
  id: string;
  name: string;
  description: string;
}

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
