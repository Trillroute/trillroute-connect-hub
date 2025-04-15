
import React, { useEffect } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from '@/components/ui/checkbox';
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Teacher, DurationMetric } from '@/types/course';
import { Skill } from '@/hooks/useSkills';

export interface CourseFormValues {
  title: string;
  description: string;
  instructors: string[];
  level: string;
  category: string;
  durationValue: string;
  durationMetric: DurationMetric;
  durationType: string;
  image: string;
  // New fields
  classesCount: string;
  classesDuration: string;
  studioSessionsCount: string;
  studioSessionsDuration: string;
  practicalSessionsCount: string;
  practicalSessionsDuration: string;
}

interface CourseFormProps {
  form: UseFormReturn<CourseFormValues>;
  onSubmit: (data: CourseFormValues) => void;
  teachers: Teacher[];
  skills: Skill[];
  submitButtonText: string;
  cancelAction: () => void;
}

// Predefined skill levels array
const skillLevels = [
  "For Anyone",
  "Early Beginner",
  "Beginner",
  "Late Beginner",
  "Early Intermediate",
  "Intermediate",
  "Late Intermediate",
  "Advanced"
];

const CourseForm: React.FC<CourseFormProps> = ({
  form,
  onSubmit,
  teachers,
  skills = [], 
  submitButtonText,
  cancelAction
}) => {
  // Ensure teachers and skills are always arrays
  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safeSkills = Array.isArray(skills) ? skills : [];

  // Log data for debugging
  console.log('Teachers received in CourseForm:', safeTeachers);
  console.log('Teacher count:', safeTeachers.length);
  
  // Ensure form instructors field is an array
  useEffect(() => {
    const currentInstructors = form.getValues('instructors');
    if (!Array.isArray(currentInstructors)) {
      form.setValue('instructors', []);
    }
  }, [form]);

  const durationType = form.watch('durationType');

  // Helper to get teacher name by ID
  const getTeacherName = (id: string) => {
    const teacher = safeTeachers.find(t => t.id === id);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher';
  };

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
              <div className="space-y-2">
                {/* Show selected instructors as badges */}
                {Array.isArray(field.value) && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {field.value.map(instructorId => (
                      <Badge 
                        key={instructorId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {getTeacherName(instructorId)}
                        <button
                          type="button"
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onClick={(e) => {
                            e.preventDefault();
                            const newValue = field.value.filter((id) => id !== instructorId);
                            field.onChange(newValue);
                          }}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {getTeacherName(instructorId)}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Teacher selection with checkboxes */}
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  {safeTeachers.length > 0 ? (
                    safeTeachers.map((teacher) => {
                      const isSelected = Array.isArray(field.value) && field.value.includes(teacher.id);
                      return (
                        <div key={teacher.id} className="flex items-center space-x-2 py-1">
                          <Checkbox 
                            id={`teacher-${teacher.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const currentValue = Array.isArray(field.value) ? field.value : [];
                              const newValue = checked
                                ? [...currentValue, teacher.id]
                                : currentValue.filter(id => id !== teacher.id);
                              field.onChange(newValue);
                            }}
                          />
                          <label
                            htmlFor={`teacher-${teacher.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {teacher.first_name} {teacher.last_name}
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-2 text-sm text-muted-foreground">No teachers available</div>
                  )}
                </div>
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
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
        
        {durationType === "fixed" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="durationValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration Value</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 8, 12, etc." 
                      {...field} 
                      onChange={(e) => {
                        // Ensure only positive numbers
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(value.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="durationMetric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration Unit</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {/* Classes - Always visible now */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-3">Classes</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="classesCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Classes</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 10" 
                      {...field} 
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(value.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classesDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 60" 
                      {...field} 
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(value.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Studio Sessions - Always visible now */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-3">Studio Sessions</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="studioSessionsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Studio Sessions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 5" 
                      {...field} 
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(value.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studioSessionsDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Studio Session Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 120" 
                      {...field} 
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(value.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Practical Sessions - Always visible now */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-3">Practical Sessions</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="practicalSessionsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Practical Sessions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 8" 
                      {...field} 
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(value.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="practicalSessionsDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Practical Session Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 90" 
                      {...field} 
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(value.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
