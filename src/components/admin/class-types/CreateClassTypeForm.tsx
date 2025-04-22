
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DURATION_METRICS = [
  "minutes",
  "hours",
  "days",
  "week",
  "month",
  "year",
  "unlimited"
] as const;

const CreateClassTypeForm = ({ onCreated }: { onCreated?: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_metric: "minutes",
    duration_value: "",
    max_students: "",
    price_inr: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const classTypeData = {
      name: form.name.trim(),
      description: form.description.trim(),
      duration_metric: form.duration_metric,
      duration_value: form.duration_value ? Number(form.duration_value) : null,
      max_students: Number(form.max_students),
      price_inr: Number(form.price_inr)
    };

    const { error } = await supabase.from("class_types").insert([classTypeData]);

    if (error) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
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
        price_inr: ""
      });
      if (onCreated) onCreated();
    }
    setLoading(false);
  };

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
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Class Type"}
      </Button>
    </form>
  );
};

export default CreateClassTypeForm;
