
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ClassType } from "./ClassTypeTable";

interface EditClassTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classType: ClassType | null;
  onSuccess: () => void;
}

const EditClassTypeDialog: React.FC<EditClassTypeDialogProps> = ({
  open,
  onOpenChange,
  classType,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: classType?.name || "",
    description: classType?.description || "",
    duration_metric: classType?.duration_metric || "",
    duration_value: classType?.duration_value || 0,
    max_students: classType?.max_students || 1,
    price_inr: classType?.price_inr || 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (classType) {
      setForm({
        name: classType.name,
        description: classType.description,
        duration_metric: classType.duration_metric,
        duration_value: classType.duration_value ?? 0,
        max_students: classType.max_students,
        price_inr: classType.price_inr,
      });
    }
  }, [classType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "max_students" || name === "price_inr" || name === "duration_value"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("class_types")
        .update({
          name: form.name,
          description: form.description,
          duration_metric: form.duration_metric,
          duration_value: form.duration_value,
          max_students: form.max_students,
          price_inr: form.price_inr,
        })
        .eq("id", classType?.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update class type. " + error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Class Type Updated",
        description: "Class type updated successfully.",
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Class Type</DialogTitle>
        </DialogHeader>
        {classType && (
          <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm">Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm">Description</label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="mt-1 resize-none min-h-[80px] max-h-[180px]"
                maxLength={500}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm">Duration Metric</label>
                <Input
                  name="duration_metric"
                  value={form.duration_metric}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm">Duration Value</label>
                <Input
                  name="duration_value"
                  type="number"
                  value={form.duration_value}
                  onChange={handleChange}
                  className="mt-1"
                  min={1}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm">Max Students</label>
                <Input
                  name="max_students"
                  type="number"
                  value={form.max_students}
                  onChange={handleChange}
                  min={1}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm">Price (INR)</label>
                <Input
                  name="price_inr"
                  type="number"
                  value={form.price_inr}
                  onChange={handleChange}
                  min={0}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditClassTypeDialog;
