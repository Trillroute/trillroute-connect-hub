
import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateClassTypeForm from "./CreateClassTypeForm";
import ClassTypeTable from "./ClassTypeTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ClassTypeManagement: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [canManageClassTypes, setCanManageClassTypes] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in and has admin permissions
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
    <section className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Class Types Management</h2>
        {canManageClassTypes && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-music-500 hover:bg-music-600" onClick={handleCreateClassType}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Class Type
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
      <ClassTypeTable />
    </section>
  );
};

export default ClassTypeManagement;
