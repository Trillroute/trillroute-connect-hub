
import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, LayoutGrid, Grid2x2, LayoutList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateClassTypeForm from "./CreateClassTypeForm";
import ClassTypeTable from "./ClassTypeTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ClassTypeManagement: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [canManageClassTypes, setCanManageClassTypes] = useState(false);

  const [viewMode, setViewMode] = useState<"list" | "grid" | "tile">("list");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      const checkPermissions = async () => {
        if (isAdmin() || isSuperAdmin()) {
          setCanManageClassTypes(true);
        } else {
          setCanManageClassTypes(false);
        }
      };
      checkPermissions();
    } else {
      setCanManageClassTypes(false);
    }
  }, [user, isAdmin, isSuperAdmin]);

  const handleCreateClassType = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create class types.",
        variant: "destructive",
      });
      return;
    }
    if (!canManageClassTypes) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create class types.",
        variant: "destructive",
      });
      return;
    }
    setDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle>Class Types Management</CardTitle>
            <CardDescription>Manage different types of classes</CardDescription>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button
              size="sm"
              variant={viewMode === 'list' ? "secondary" : "outline"}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'grid' ? "secondary" : "outline"}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'tile' ? "secondary" : "outline"}
              onClick={() => setViewMode('tile')}
              title="Tile view"
            >
              <Grid2x2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {canManageClassTypes && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white flex items-center gap-2" onClick={handleCreateClassType}>
                    <Plus className="h-4 w-4" />
                    Add Class Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Class Type</DialogTitle>
                  </DialogHeader>
                  <CreateClassTypeForm onCreated={() => setDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-md mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search class types..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <ClassTypeTable viewMode={viewMode} searchQuery={searchQuery} />
      </CardContent>
    </Card>
  );
};

export default ClassTypeManagement;
