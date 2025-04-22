
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateClassTypeForm from "./CreateClassTypeForm";
import ClassTypeTable from "./ClassTypeTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ClassTypeManagement: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Class Types Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-music-500 hover:bg-music-600">
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
      </div>
      <ClassTypeTable />
    </section>
  );
};

export default ClassTypeManagement;
