
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Shield, Trash } from 'lucide-react';

export interface Level {
  id: string;
  name: string;
  description: string;
  studentPermissions: string[];
  teacherPermissions: string[];
  adminPermissions: string[];
  leadPermissions: string[];
  coursePermissions: string[];
  levelPermissions: string[];
}

interface LevelTableProps {
  levels: Level[];
  isLoading: boolean;
  onEdit?: (level: Level) => void;
  onDelete?: (level: Level) => void;
  onViewPermissions: (level: Level) => void;
  onEditPermissions?: (level: Level) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  visibleColumns: string[];
}

const LevelTable: React.FC<LevelTableProps> = ({
  levels,
  isLoading,
  onEdit,
  onDelete,
  onViewPermissions,
  onEditPermissions,
  selectedIds,
  setSelectedIds,
  visibleColumns,
}) => {
  // Toggle selection of a single item
  const toggleSelection = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );
  };

  // Toggle selection of all items
  const toggleSelectAll = () => {
    if (selectedIds.length === levels.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(levels.map((level) => level.id));
    }
  };

  // Calculate total permissions for a level
  const calculateTotalPermissions = (level: Level): number => {
    return (
      level.studentPermissions.length +
      level.teacherPermissions.length +
      level.adminPermissions.length +
      level.leadPermissions.length +
      level.coursePermissions.length +
      level.levelPermissions.length
    );
  };

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  levels.length > 0 && selectedIds.length === levels.length
                }
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            {visibleColumns.includes('name') && (
              <TableHead>Name</TableHead>
            )}
            {visibleColumns.includes('description') && (
              <TableHead>Description</TableHead>
            )}
            {visibleColumns.includes('permissions') && (
              <TableHead>Permissions</TableHead>
            )}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : levels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No levels found.
              </TableCell>
            </TableRow>
          ) : (
            levels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="p-2">
                  <Checkbox
                    checked={selectedIds.includes(level.id)}
                    onCheckedChange={() => toggleSelection(level.id)}
                    aria-label={`Select ${level.name}`}
                  />
                </TableCell>
                {visibleColumns.includes('name') && (
                  <TableCell className="font-medium">{level.name}</TableCell>
                )}
                {visibleColumns.includes('description') && (
                  <TableCell className="max-w-xs truncate">
                    {level.description}
                  </TableCell>
                )}
                {visibleColumns.includes('permissions') && (
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {calculateTotalPermissions(level)} permissions
                    </span>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewPermissions(level)}
                      title="View permissions"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {onEditPermissions && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditPermissions(level)}
                        title="Edit permissions"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(level)}
                        title="Edit level"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(level)}
                        title="Delete level"
                        className="text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LevelTable;
