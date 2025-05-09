
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
import { Badge } from '@/components/ui/badge';

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
      level.levelPermissions.length +
      level.eventsPermissions.length +
      level.classTypesPermissions.length +
      level.userAvailabilityPermissions.length
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
      {levels.map((level) => (
        <Card 
          key={level.id} 
          className={`${selectedIds.includes(level.id) ? 'border-primary ring-1 ring-primary' : ''} 
                     transition-all hover:shadow-md`}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">{level.name}</CardTitle>
                <Badge variant="secondary" className="font-normal">
                  {calculateTotalPermissions(level)} permissions
                </Badge>
              </div>
              <Checkbox
                checked={selectedIds.includes(level.id)}
                onCheckedChange={() => toggleSelection(level.id)}
                aria-label={`Select ${level.name}`}
                className="mt-1"
              />
            </div>
          </CardHeader>
          
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{level.description}</p>
          </CardContent>
          
          <CardFooter className="flex justify-between items-center pt-3 border-t">
            <div className="text-sm text-muted-foreground">Role</div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewPermissions(level)}
                className="h-8 w-8 p-0"
                title="View permissions"
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              {onEditPermissions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditPermissions(level)}
                  className="h-8 w-8 p-0"
                  title="Edit permissions"
                >
                  <Shield className="h-4 w-4" />
                </Button>
              )}
              
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(level)}
                  className="h-8 w-8 p-0"
                  title="Edit level"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(level)}
                  className="h-8 w-8 p-0 hover:text-destructive"
                  title="Delete level"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LevelGrid;
