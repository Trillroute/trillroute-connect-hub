import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, LayoutGrid, Grid2x2, LayoutList, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateClassTypeForm from "./CreateClassTypeForm";
import ClassTypeTable from "./ClassTypeTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ClassType } from "./ClassTypeTable";
import EditClassTypeDialog from "./EditClassTypeDialog";
import ViewClassTypeDialog from "./ViewClassTypeDialog";

const ClassTypeManagement: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [canManageClassTypes, setCanManageClassTypes] = useState(false);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassTypeIds, setSelectedClassTypeIds] = useState<string[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classTypeToDelete, setClassTypeToDelete] = useState<ClassType | null>(null);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState<ClassType | null>(null);

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

  useEffect(() => {
    fetchClassTypes();
    
    const subscription = supabase
      .channel('class_types_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'class_types' }, () => {
        fetchClassTypes();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchClassTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching class types:", error);
        toast({
          title: "Error",
          description: "Failed to load class types. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setClassTypes(data || []);
    } catch (error) {
      console.error("Unexpected error fetching class types:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading class types.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditClassType = (classType: ClassType) => {
    setSelectedClassType(classType);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClassType = (classType: ClassType) => {
    setClassTypeToDelete(classType);
    setIsDeleteDialogOpen(true);
  };

  const handleViewClassType = (classType: ClassType) => {
    console.log("View:", classType);
    setSelectedClassType(classType);
    setIsViewDialogOpen(true);
  };

  const handleBulkDelete = async () => {
    if (selectedClassTypeIds.length === 0) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('class_types')
        .delete()
        .in('id', selectedClassTypeIds);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `Deleted ${selectedClassTypeIds.length} class types successfully.`
      });
      
      setSelectedClassTypeIds([]);
      setIsBulkDeleteDialogOpen(false);
      fetchClassTypes();
    } catch (error: any) {
      console.error("Error deleting class types:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete class types. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSingleDelete = async () => {
    if (!classTypeToDelete) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('class_types')
        .delete()
        .eq('id', classTypeToDelete.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `Deleted ${classTypeToDelete.name} successfully.`
      });
      
      setClassTypeToDelete(null);
      setIsDeleteDialogOpen(false);
      fetchClassTypes();
    } catch (error: any) {
      console.error("Error deleting class type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete class type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClassTypeId = (id: string) => {
    setSelectedClassTypeIds(prev => 
      prev.includes(id)
        ? prev.filter(classTypeId => classTypeId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedClassTypeIds(ids);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle>Class Types Management</CardTitle>
            <CardDescription>Manage different types of classes</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
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
            <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={fetchClassTypes}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {selectedClassTypeIds.length > 0 && (
              <Button 
                size="sm" 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedClassTypeIds.length})
              </Button>
            )}
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
        <ClassTypeTable 
          classTypes={classTypes}
          loading={loading}
          onEditClassType={handleEditClassType}
          onDeleteClassType={handleDeleteClassType}
          onViewClassType={handleViewClassType}
          viewMode={viewMode}
          searchQuery={searchQuery}
          selectedClassTypeIds={selectedClassTypeIds}
          onSelectClassTypeId={handleSelectClassTypeId}
          onSelectAll={handleSelectAll}
        />
      </CardContent>

      <EditClassTypeDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        classType={selectedClassType} 
        onSuccess={fetchClassTypes}
      />

      <ViewClassTypeDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        classType={selectedClassType}
      />

      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedClassTypeIds.length} class types. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete Selected"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {classTypeToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSingleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ClassTypeManagement;
