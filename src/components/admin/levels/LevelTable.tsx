
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
import { Pencil, Trash2, Shield, Search, LayoutList, LayoutGrid, Grid2x2 } from 'lucide-react';
import { AdminLevelDetailed } from '@/types/adminLevel';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";

interface LevelTableProps {
  levels: AdminLevelDetailed[];
  isLoading: boolean;
  onEditLevel: (level: AdminLevelDetailed) => void;
  onDeleteLevel: (level: AdminLevelDetailed) => void;
  onViewPermissions: (level: AdminLevelDetailed) => void;
  viewMode?: 'list' | 'grid' | 'tile';
  selectedIds?: number[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<number[]>>;
}

const LevelTable = ({
  levels,
  isLoading,
  onEditLevel,
  onDeleteLevel,
  onViewPermissions,
  viewMode = 'list',
  selectedIds = [],
  setSelectedIds = () => {},
}: LevelTableProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredLevels = levels.filter(level =>
    level.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (level.description && level.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const allLevelIds = filteredLevels.map(l => l.id);
  const allSelected = selectedIds.length > 0 && allLevelIds.length > 0 && allLevelIds.every(id => selectedIds.includes(id));

  // List view
  if (viewMode === 'list') {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (filteredLevels.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No admin levels found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="relative w-full mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search levels..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-6 py-3">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => {
                      if (allSelected) setSelectedIds([]);
                      else setSelectedIds(allLevelIds);
                    }}
                    aria-label="Select all"
                  />
                </div>
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLevels.map((level) => (
              <TableRow key={level.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(level.id)}
                    onCheckedChange={() => {
                      if (selectedIds.includes(level.id)) {
                        setSelectedIds(selectedIds.filter(id => id !== level.id));
                      } else {
                        setSelectedIds([...selectedIds, level.id]);
                      }
                    }}
                    aria-label={`Select ${level.name}`}
                  />
                </TableCell>
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
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteLevel(level)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" color="#000000" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="text-sm text-muted-foreground pt-2">
          Showing {filteredLevels.length} of {levels.length} levels
        </div>
      </div>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div>
        <div className="flex mb-2">
          <Input
            type="search"
            placeholder="Search levels..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLevels.map(level => (
            <div
              key={level.id}
              className="bg-muted rounded-lg shadow-sm p-4 flex flex-col border relative"
            >
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={selectedIds.includes(level.id)}
                  onCheckedChange={() => {
                    if (selectedIds.includes(level.id)) {
                      setSelectedIds(selectedIds.filter(id => id !== level.id));
                    } else {
                      setSelectedIds([...selectedIds, level.id]);
                    }
                  }}
                  aria-label={`Select ${level.name}`}
                />
              </div>
              <div className="font-semibold">{level.name}</div>
              <div className="text-xs text-gray-400 mt-1 truncate">{level.description}</div>
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onViewPermissions(level)}>
                  <Shield className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditLevel(level)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteLevel(level)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground pt-2 mt-2">
          Showing {filteredLevels.length} of {levels.length} levels
        </div>
      </div>
    );
  }

  // Tile view
  if (viewMode === 'tile') {
    return (
      <div>
        <div className="flex mb-2">
          <Input
            type="search"
            placeholder="Search levels..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          {filteredLevels.map(level => (
            <div
              key={level.id}
              className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center border relative"
            >
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={selectedIds.includes(level.id)}
                  onCheckedChange={() => {
                    if (selectedIds.includes(level.id)) {
                      setSelectedIds(selectedIds.filter(id => id !== level.id));
                    } else {
                      setSelectedIds([...selectedIds, level.id]);
                    }
                  }}
                  aria-label={`Select ${level.name}`}
                />
              </div>
              <div className="font-semibold">{level.name}</div>
              <div className="text-xs text-gray-400 mt-1 truncate">{level.description}</div>
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onViewPermissions(level)}>
                  <Shield className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditLevel(level)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteLevel(level)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground pt-2 mt-2">
          Showing {filteredLevels.length} of {levels.length} levels
        </div>
      </div>
    );
  }

  return null;
};

export default LevelTable;
