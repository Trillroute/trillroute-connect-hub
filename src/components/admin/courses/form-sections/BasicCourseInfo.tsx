
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CourseFormValues } from '../CourseForm';

interface BasicCourseInfoProps {
  form: UseFormReturn<CourseFormValues>;
  skills: { id: string; name: string }[];
}

const BasicCourseInfo: React.FC<BasicCourseInfoProps> = ({ form, skills }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">Title *</FormLabel>
            <FormControl>
              <Input placeholder="Enter course title" className="w-full" {...field} />
            </FormControl>
            <FormDescription>
              Choose a clear and descriptive title
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
            <FormLabel className="text-sm font-semibold">Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what students will learn"
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">Level *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || "Beginner"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select course level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="For Anyone">For Anyone</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="skill"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">Skill *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || "_no_skill_selected"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary skill" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
                <SelectItem value="_no_skill_selected">No Skill Selected</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">Image URL *</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicCourseInfo;
