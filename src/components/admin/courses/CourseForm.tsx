
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Teacher } from '@/types/course';
import { Skill } from '@/hooks/useSkills';

export interface CourseFormValues {
  title: string;
  description: string;
  instructors: string[];
  level: string;
  category: string;
  duration: string;
  durationType: string;
  image: string;
}

interface CourseFormProps {
  form: UseFormReturn<CourseFormValues>;
  onSubmit: (data: CourseFormValues) => void;
  teachers: Teacher[];
  skills: Skill[];
  submitButtonText: string;
  cancelAction: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  form,
  onSubmit,
  teachers,
  skills = [], // Provide a default empty array
  submitButtonText,
  cancelAction
}) => {
  // Ensure teachers is always an array
  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  // Ensure skills is always an array
  const safeSkills = Array.isArray(skills) ? skills : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Course Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="instructors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructors</FormLabel>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <div className="flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <div className="flex flex-wrap gap-1">
                          {field.value.map((instructorId) => {
                            const teacher = safeTeachers.find((t) => t.id === instructorId);
                            return teacher ? (
                              <Badge 
                                key={teacher.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {teacher.first_name} {teacher.last_name}
                                <button
                                  type="button"
                                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newValue = field.value.filter((id) => id !== teacher.id);
                                    field.onChange(newValue);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Remove {teacher.first_name} {teacher.last_name}</span>
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                        <button 
                          type="button" 
                          className="ml-auto h-4 w-4 shrink-0 opacity-50"
                        >
                          <ChevronsUpDown className="h-4 w-4" />
                          <span className="sr-only">Show instructors</span>
                        </button>
                      </div>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search instructors..." />
                      <CommandEmpty>No instructors found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {safeTeachers.map((teacher) => {
                          const isSelected = field.value.includes(teacher.id);
                          return (
                            <CommandItem
                              key={teacher.id}
                              value={`${teacher.first_name.toLowerCase()} ${teacher.last_name.toLowerCase()}`}
                              onSelect={() => {
                                const newValue = isSelected
                                  ? field.value.filter((id) => id !== teacher.id)
                                  : [...field.value, teacher.id];
                                field.onChange(newValue);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {teacher.first_name} {teacher.last_name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Course description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
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
                    {safeSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Beginner, Advanced, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 8 weeks, 3 months, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="durationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration Type</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    className="flex space-x-4"
                    value={field.value}
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fixed" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Fixed
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="recurring" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Recurring
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="URL to course image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CourseForm;
