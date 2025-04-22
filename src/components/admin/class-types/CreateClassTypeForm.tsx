import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DURATION_METRICS = [
  "minutes",
  "hours",
  "days",
  "week",
  "month",
  "year",
  "unlimited"
] as const;

const LOCATION_OPTIONS = [
  "Trill Route, Indiranagar",
  "Online",
];

const CreateClassTypeForm = ({ onCreated }: { onCreated?: () => void }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_metric: "minutes",
    duration_value: "",
    max_students: "",
    price_inr: "",
    location: LOCATION_OPTIONS[0],
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create class types.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    if (!form.name.trim() || !form.description.trim() || !form.duration_metric || !form.max_students || !form.price_inr) {
      toast({
        title: "Missing Fields",
        description: "All fields except duration value are required.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    let uploadedImageUrl = null;
    if (imageFile) {
      // @ts-ignore
      const { uploadFile } = await import("@/utils/fileUpload");
      const url = await uploadFile(imageFile, "class-types");
      if (!url) {
        toast({
          title: "Image Upload Failed",
          description: "Please try a different image file.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      uploadedImageUrl = url;
    }

    const classTypeData = {
      name: form.name.trim(),
      description: form.description.trim(),
      duration_metric: form.duration_metric,
      duration_value: form.duration_value ? Number(form.duration_value) : null,
      max_students: Number(form.max_students),
      price_inr: Number(form.price_inr),
      location: form.location,
      image: uploadedImageUrl,
    };

    console.log("Creating class type with data:", classTypeData);
    console.log("Current user:", user);

    const { error, data } = await supabase.from("class_types").insert([classTypeData]).select();

    if (error) {
      console.error("Error creating class type:", error);
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log("Class type created successfully:", data);
      toast({
        title: "Class Type Created",
        description: `${form.name} added successfully!`,
        variant: "default"
      });
      setForm({
        name: "",
        description: "",
        duration_metric: "minutes",
        duration_value: "",
        max_students: "",
        price_inr: "",
        location: LOCATION_OPTIONS[0],
      });
      setImageFile(null);
      setImagePreview(null);
      if (onCreated) onCreated();
    }
    setLoading(false);
  };

  if (!user) {
    return <div className="py-4 text-center text-gray-500">Please log in to create class types.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-white border rounded-lg p-6 shadow mt-2">
      <h2 className="text-lg font-bold mb-2">Create New Class Type</h2>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">Class Name</label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Group Lesson"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Briefly describe this class type..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="duration_metric">Duration Metric</label>
        <select
          className="w-full border rounded-md text-sm px-2 py-2"
          id="duration_metric"
          name="duration_metric"
          value={form.duration_metric}
          onChange={handleChange}
        >
          {DURATION_METRICS.map((metric) => (
            <option key={metric} value={metric}>{metric.charAt(0).toUpperCase() + metric.slice(1)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="duration_value">Duration Value</label>
        <Input
          id="duration_value"
          name="duration_value"
          type="number"
          value={form.duration_value}
          onChange={handleChange}
          placeholder="e.g. 60 (leave blank for unlimited)"
          min="1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="max_students">Max Students</label>
        <Input
          id="max_students"
          name="max_students"
          type="number"
          required
          value={form.max_students}
          onChange={handleChange}
          placeholder="e.g. 10"
          min="1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="price_inr">Price per Class (INR)</label>
        <Input
          id="price_inr"
          name="price_inr"
          type="number"
          required
          value={form.price_inr}
          onChange={handleChange}
          placeholder="e.g. 500"
          min="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="location">Location</label>
        <select
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded-md text-sm px-2 py-2"
        >
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="image">
          Class Image (optional)
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 rounded w-24 h-24 object-cover border" />
        )}
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Class Type"}
      </Button>
    </form>
  );
};

export default CreateClassTypeForm;
