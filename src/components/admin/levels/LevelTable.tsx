
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Shield } from 'lucide-react';
import { AdminLevelDetailed } from '@/types/adminLevel';
import { Skeleton } from '@/components/ui/skeleton';

interface LevelTableProps {
  levels: AdminLevelDetailed[];
  isLoading: boolean;
  onEditLevel: (level: AdminLevelDetailed) => void;
  onDeleteLevel: (level: AdminLevelDetailed) => void;
  onViewPermissions: (level: AdminLevelDetailed) => void;
}

const LevelTable = ({
  levels,
  isLoading,
  onEditLevel,
  onDeleteLevel,
  onViewPermissions,
}: LevelTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No admin levels found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {levels.map((level) => (
          <TableRow key={level.id}>
            <TableCell>{level.id}</TableCell>
            <TableCell>{level.name}</TableCell>
            <TableCell className="max-w-xs truncate">{level.description}</TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewPermissions(level)}
                className="flex items-center"
              >
                <Shield className="h-4 w-4 mr-1" />
                View
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditLevel(level)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteLevel(level)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LevelTable;
