
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
import { supabase } from "@/integrations/supabase/client";
import { ClassType } from "./ClassTypeTable";

const ClassTypeManagement: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [canManageClassTypes, setCanManageClassTypes] = useState(false);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

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
    
    // Set up subscription for realtime updates
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
    toast({
      title: "Edit Class Type",
      description: `Editing ${classType.name}`,
    });
    // Add edit functionality here
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
            <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={fetchClassTypes}>
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
        <ClassTypeTable 
          classTypes={classTypes}
          loading={loading}
          onEditClassType={handleEditClassType}
          onDeleteClassType={(classType) => console.log("Delete:", classType)}
          onViewClassType={(classType) => console.log("View:", classType)}
          viewMode={viewMode}
          searchQuery={searchQuery}
        />
      </CardContent>
    </Card>
  );
};

export default ClassTypeManagement;
