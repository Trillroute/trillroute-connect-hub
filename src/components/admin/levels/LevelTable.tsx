
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Shield } from 'lucide-react';
import { AdminLevelDetailed } from '@/types/adminLevel';
import { Checkbox } from '@/components/ui/checkbox';

export interface Level extends Omit<AdminLevelDetailed, 'id'> {
  id: string; // Use string type for the id in the UI layer
}

interface LevelTableProps {
  levels: Level[];
  isLoading: boolean;
  onEdit: (level: AdminLevelDetailed) => void;
  onDelete: (level: AdminLevelDetailed) => void;
  onViewPermissions: (level: AdminLevelDetailed) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
  visibleColumns: string[];
}

const LevelTable: React.FC<LevelTableProps> = ({
  levels,
  isLoading,
  onEdit,
  onDelete,
  onViewPermissions,
  selectedIds,
  setSelectedIds,
  onBulkDelete,
  visibleColumns,
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(levels.map((level) => level.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectLevel = (levelId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, levelId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== levelId));
    }
  };

  // Convert string ID to number when passing to handlers
  const convertLevel = (level: Level): AdminLevelDetailed => {
    return {
      ...level,
      id: Number(level.id)
    };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === levels.length && levels.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            {visibleColumns.includes('name') && <TableHead>Name</TableHead>}
            {visibleColumns.includes('description') && <TableHead>Description</TableHead>}
            {visibleColumns.includes('permissions') && <TableHead>Permissions</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : levels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No admin levels found
              </TableCell>
            </TableRow>
          ) : (
            levels.map((level) => (
              <TableRow key={level.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(level.id)}
                    onCheckedChange={(checked) => handleSelectLevel(level.id, !!checked)}
                    aria-label={`Select ${level.name}`}
                  />
                </TableCell>
                {visibleColumns.includes('name') && <TableCell>{level.name}</TableCell>}
                {visibleColumns.includes('description') && <TableCell>{level.description}</TableCell>}
                {visibleColumns.includes('permissions') && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {level.studentPermissions?.includes('view') && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          Students
                        </span>
                      )}
                      {level.teacherPermissions?.includes('view') && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                          Teachers
                        </span>
                      )}
                      {level.adminPermissions?.includes('view') && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                          Admins
                        </span>
                      )}
                      {level.leadPermissions?.includes('view') && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                          Leads
                        </span>
                      )}
                      {level.coursePermissions?.includes('view') && (
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded">
                          Courses
                        </span>
                      )}
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewPermissions(convertLevel(level))}
                      title="Permissions"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(convertLevel(level))}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(convertLevel(level))}
                      title="Delete"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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
