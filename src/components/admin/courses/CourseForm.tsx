import React, { useEffect } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { 
  FormField, FormItem, FormLabel, FormControl, 
  FormDescription, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Teacher } from '@/types/course';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Student } from '@/hooks/useStudents';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

export interface CourseFormValues {
  title: string;
  description: string;
  instructors: string[];
  students?: string[];
  level: string;
  skill: string;
  durationType: "fixed" | "recurring";
  durationValue?: string;
  durationMetric?: "days" | "weeks" | "months" | "years";
  image: string;
  classesCount: string;
  classesDuration: string;
  studioSessionsCount: string;
  studioSessionsDuration: string;
  practicalSessionsCount: string;
  practicalSessionsDuration: string;
}

interface CourseFormProps {
  form: UseFormReturn<CourseFormValues>;
  onSubmit: (values: CourseFormValues) => void;
  teachers: Teacher[];
  skills: { id: string; name: string }[];
  students?: Student[];
  submitButtonText?: string;
  cancelAction?: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  form,
  onSubmit,
  teachers,
  skills,
  students = [],
  submitButtonText = "Submit",
  cancelAction
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  useEffect(() => {
    const instructorsValue = form.watch('instructors');
    const studentsValue = form.watch('students');
    console.log('CourseForm - instructors value:', instructorsValue);
    console.log('CourseForm - students value:', studentsValue);
  }, [form]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Course title" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of the course that will be displayed to users.
              </FormDescription>
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
                <Textarea
                  placeholder="Course description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe what the course is about.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="For Anyone">For Anyone</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Specify the level of difficulty of the course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the primary skill or category for this course.
                </FormDescription>
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
              <FormDescription>
                Select the instructors for this course
              </FormDescription>
              <Card>
                <ScrollArea className="h-60">
                  <CardContent className="pt-4 space-y-2">
                    {teachers.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        No teachers available
                      </div>
                    ) : (
                      teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`teacher-${teacher.id}`}
                            checked={field.value?.includes(teacher.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = Array.isArray(field.value) ? [...field.value] : [];
                              
                              if (checked) {
                                // Add to selection
                                if (!currentValues.includes(teacher.id)) {
                                  field.onChange([...currentValues, teacher.id]);
                                }
                              } else {
                                // Remove from selection
                                field.onChange(currentValues.filter(id => id !== teacher.id));
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`teacher-${teacher.id}`}
                            className="cursor-pointer"
                          >
                            {teacher.first_name} {teacher.last_name}
                          </Label>
                        </div>
                      ))
                    )}
                  </CardContent>
                </ScrollArea>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="students"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Students</FormLabel>
              <FormDescription>
                Select the students who should be enrolled in this course
              </FormDescription>
              <Card>
                <ScrollArea className="h-60">
                  <CardContent className="pt-4 space-y-2">
                    {students.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        No students available
                      </div>
                    ) : (
                      students.map((student) => (
                        <div key={student.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`student-${student.id}`}
                            checked={field.value?.includes(student.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = Array.isArray(field.value) ? [...field.value] : [];
                              
                              if (checked) {
                                // Add to selection
                                if (!currentValues.includes(student.id)) {
                                  field.onChange([...currentValues, student.id]);
                                }
                              } else {
                                // Remove from selection
                                field.onChange(currentValues.filter(id => id !== student.id));
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`student-${student.id}`} 
                            className="cursor-pointer"
                          >
                            {student.first_name} {student.last_name}
                          </Label>
                        </div>
                      ))
                    )}
                  </CardContent>
                </ScrollArea>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="durationType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Duration Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fixed" />
                      </FormControl>
                      <FormLabel>Fixed</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="recurring" />
                      </FormControl>
                      <FormLabel>Recurring</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Specify whether the course has a fixed or recurring duration.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("durationType") === "fixed" && (
            <>
              <FormField
                control={form.control}
                name="durationValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration value" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the duration value.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMetric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Metric</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a metric" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the unit of time for the duration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL for the course image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="classesCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Classes</FormLabel>
                <FormControl>
                  <Input placeholder="Number of classes" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the total number of classes in the course.
                </FormDescription>
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
                  <Input placeholder="Class duration" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Specify the duration of each class in minutes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studioSessionsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Studio Sessions</FormLabel>
                <FormControl>
                  <Input placeholder="Number of studio sessions" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the total number of studio sessions in the course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="studioSessionsDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Studio Session Duration (minutes)</FormLabel>
                <FormControl>
                  <Input placeholder="Studio session duration" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Specify the duration of each studio session in minutes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="practicalSessionsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Practical Sessions</FormLabel>
                <FormControl>
                  <Input placeholder="Number of practical sessions" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the total number of practical sessions in the course.
                </FormDescription>
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
                  <Input placeholder="Practical session duration" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Specify the duration of each practical session in minutes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4 flex justify-end gap-2">
          {cancelAction && (
            <Button type="button" variant="outline" onClick={cancelAction}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-music-500 hover:bg-music-600">
            {submitButtonText}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CourseForm;
