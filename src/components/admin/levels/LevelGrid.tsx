
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Shield, Trash } from 'lucide-react';
import { Level } from './LevelTable';

interface LevelGridProps {
  levels: Level[];
  isLoading: boolean;
  onEdit?: (level: Level) => void;
  onDelete?: (level: Level) => void;
  onViewPermissions: (level: Level) => void;
  onEditPermissions?: (level: Level) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

const LevelGrid: React.FC<LevelGridProps> = ({
  levels,
  isLoading,
  onEdit,
  onDelete,
  onViewPermissions,
  onEditPermissions,
  selectedIds,
  setSelectedIds,
}) => {
  // Toggle selection of a single item
  const toggleSelection = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>No levels found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {levels.map((level) => (
        <Card key={level.id} className={selectedIds.includes(level.id) ? 'border-primary' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{level.name}</CardTitle>
                <CardDescription className="mt-1">
                  {calculateTotalPermissions(level)} permissions
                </CardDescription>
              </div>
              <Checkbox
                checked={selectedIds.includes(level.id)}
                onCheckedChange={() => toggleSelection(level.id)}
                aria-label={`Select ${level.name}`}
              />
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500 line-clamp-2">{level.description}</p>
          </CardContent>
          <CardFooter className="flex justify-end pt-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewPermissions(level)}
              className="h-8 px-2"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            
            {onEditPermissions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditPermissions(level)}
                className="h-8 px-2"
              >
                <Shield className="h-4 w-4 mr-1" />
                Permissions
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(level)}
                className="h-8 px-2"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(level)}
                className="h-8 px-2 text-red-500 hover:text-red-600"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LevelGrid;
