
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid2x2, LayoutList, Plus, RefreshCw, Trash2 } from "lucide-react";

interface StudentHeaderControlsProps {
  viewMode: "list" | "grid" | "tile";
  setViewMode: (view: "list" | "grid" | "tile") => void;
  onRefresh: () => void;
  canAddUser: boolean;
  onAdd: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  isLoading: boolean;
}

const StudentHeaderControls: React.FC<StudentHeaderControlsProps> = ({
  viewMode,
  setViewMode,
  onRefresh,
  canAddUser,
  onAdd,
  selectedCount,
  onBulkDelete,
  isLoading
}) => (
  <div className="flex justify-between items-center">
    <div>
      <CardTitle>Student Management</CardTitle>
      <CardDescription>Manage student accounts</CardDescription>
    </div>
    <div className="flex space-x-2 items-center">
      <Button size="sm"
        variant={viewMode === 'list' ? "secondary" : "outline"}
        onClick={() => setViewMode('list')}
        title="List view"
      >
        <LayoutList className="w-4 h-4" />
      </Button>
      <Button size="sm"
        variant={viewMode === 'grid' ? "secondary" : "outline"}
        onClick={() => setViewMode('grid')}
        title="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button size="sm"
        variant={viewMode === 'tile' ? "secondary" : "outline"}
        onClick={() => setViewMode('tile')}
        title="Tile view"
      >
        <Grid2x2 className="w-4 h-4" />
      </Button>
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      {canAddUser && (
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      )}
      {selectedCount > 0 && (
        <Button
          variant="destructive"
          onClick={onBulkDelete}
          className="ml-2"
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedCount})
        </Button>
      )}
    </div>
  </div>
);

export default StudentHeaderControls;
