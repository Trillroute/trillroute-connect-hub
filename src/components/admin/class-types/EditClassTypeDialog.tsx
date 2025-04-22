import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ClassType } from "./ClassTypeTable";
import { uploadFile } from "@/utils/fileUpload";
import { supabase } from "@/integrations/supabase/client";

interface EditClassTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classType: ClassType | null;
  onSuccess: () => void;
}

const LOCATION_OPTIONS = [
  "Trill Route, Indiranagar",
  "Online",
];

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
    location: classType?.location || LOCATION_OPTIONS[0],
    image: classType?.image || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(classType?.image || null);

  React.useEffect(() => {
    if (classType) {
      setForm({
        name: classType.name,
        description: classType.description,
        duration_metric: classType.duration_metric,
        duration_value: classType.duration_value ?? 0,
        max_students: classType.max_students,
        price_inr: classType.price_inr,
        location: classType.location || LOCATION_OPTIONS[0],
        image: classType.image || "",
      });
      setImagePreview(classType.image || null);
      setImageFile(null);
    }
  }, [classType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "max_students" || name === "price_inr" || name === "duration_value"
        ? Number(value)
        : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    let uploadedImageUrl = form.image;
    if (imageFile) {
      try {
        const url = await uploadFile(imageFile, "class-types");
        if (!url) {
          toast({
            title: "Image Upload Failed",
            description: "Please try a different image file.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        uploadedImageUrl = url;
      } catch (error) {
        console.error("Image upload error:", error);
        toast({
          title: "Image Upload Error",
          description: "An unexpected error occurred during image upload.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const { error } = await supabase
        .from("class_types")
        .update({
          name: form.name,
          description: form.description,
          duration_metric: form.duration_metric,
          duration_value: form.duration_value,
          max_students: form.max_students,
          price_inr: form.price_inr,
          location: form.location,
          image: uploadedImageUrl,
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

  const handleDelete = async () => {
    if (!classType) return;
    setDeleteLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("class_types")
        .delete()
        .eq("id", classType.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete class type. " + error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Class Type Deleted",
        description: "Class type deleted successfully.",
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
      setDeleteLoading(false);
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
            <div>
              <label className="text-sm">Location</label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border rounded-md text-sm px-2 py-2 mt-1"
              >
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
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
            <div>
              <label className="text-sm">Image</label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChange}
                className="block w-full text-sm"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 rounded w-24 h-24 object-cover border" />
              )}
            </div>
            <div className="flex justify-between gap-2 pt-2">
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading || deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || deleteLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || deleteLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditClassTypeDialog;
