
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse } from 'date-fns';
import { Loader2, Calendar, Clock, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AVAILABILITY_CATEGORIES } from '@/services/availability/types';

interface TimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (startTime: string, endTime: string, category: string) => Promise<boolean>;
  initialStartTime?: string;
  initialEndTime?: string;
  initialCategory?: string;
  isEditing: boolean;
  day: string;
}

const formSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  category: z.string().min(1, "Category is required")
}).refine(data => {
  try {
    const startTime = parse(data.startTime, 'HH:mm', new Date());
    const endTime = parse(data.endTime, 'HH:mm', new Date());
    return endTime > startTime;
  } catch {
    return false;
  }
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

const TimeSlotDialog: React.FC<TimeSlotDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialStartTime,
  initialEndTime,
  initialCategory = 'Session',
  isEditing,
  day
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: initialStartTime ? format(parse(initialStartTime, 'HH:mm:ss', new Date()), 'HH:mm') : "09:00",
      endTime: initialEndTime ? format(parse(initialEndTime, 'HH:mm:ss', new Date()), 'HH:mm') : "17:00",
      category: initialCategory
    }
  });
  
  // Update form values when initialStartTime, initialEndTime, or initialCategory changes
  useEffect(() => {
    if (initialStartTime) {
      form.setValue('startTime', format(parse(initialStartTime, 'HH:mm:ss', new Date()), 'HH:mm'));
    }
    if (initialEndTime) {
      form.setValue('endTime', format(parse(initialEndTime, 'HH:mm:ss', new Date()), 'HH:mm'));
    }
    if (initialCategory) {
      form.setValue('category', initialCategory);
    }
  }, [initialStartTime, initialEndTime, initialCategory, form]);
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      const success = await onSave(values.startTime, values.endTime, values.category);
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to save the time slot. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Availability Slot" : "Add Availability Slot"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? `Update your availability slot for ${day}` 
              : `Set a time range when you're available on ${day}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <input
                        type="time"
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      End Time
                    </FormLabel>
                    <FormControl>
                      <input
                        type="time"
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABILITY_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  isEditing ? "Update" : "Add"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotDialog;
