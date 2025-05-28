
import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Teacher } from '@/types/course';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClassTypesSelector from './ClassTypesSelector';
import BasicCourseInfo from './form-sections/BasicCourseInfo';
import DurationSection from './form-sections/DurationSection';
import PricingSection from './form-sections/PricingSection';
import DiscountSection from './form-sections/DiscountSection';
import { MultiSelect, Option } from '@/components/ui/multi-select';

export interface CourseFormValues {
  title: string;
  description: string;
  level: string;
  skill: string;
  durationType: "fixed" | "recurring";
  durationValue?: string;
  durationMetric?: "days" | "weeks" | "months" | "years";
  image: string;
  instructors: string[];
  class_types_data?: { class_type_id: string; quantity: number }[];
  base_price: number;
  is_gst_applicable: boolean;
  gst_rate?: number;
  discount_metric: "percentage" | "fixed";
  discount_value?: number;
  discount_validity?: string;
  discount_code?: string;
  course_type: "solo" | "duo" | "group";
}

interface CourseFormProps {
  form: UseFormReturn<CourseFormValues>;
  onSubmit: (values: CourseFormValues) => void;
  teachers: Teacher[];
  skills: { id: string; name: string }[];
  submitButtonText?: string;
  cancelAction?: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  form,
  onSubmit,
  teachers,
  skills,
  submitButtonText = "Submit",
  cancelAction
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  const calculateFinalPrice = () => {
    let finalPrice = Number(form.watch('base_price')) || 0;
    if (form.watch('is_gst_applicable') && form.watch('gst_rate')) {
      finalPrice += (finalPrice * Number(form.watch('gst_rate'))) / 100;
    }
    
    if (form.watch('discount_value') && form.watch('discount_value') > 0) {
      if (form.watch('discount_metric') === 'percentage') {
        finalPrice -= (finalPrice * Number(form.watch('discount_value'))) / 100;
      } else {
        finalPrice -= Number(form.watch('discount_value'));
      }
    }
    return finalPrice.toFixed(2);
  };

  // Convert teachers to options for MultiSelect
  const teacherOptions: Option[] = teachers.map(teacher => ({
    label: `${teacher.first_name} ${teacher.last_name}`,
    value: teacher.id
  }));

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsContent value="basic" className="mt-4 space-y-4">
            <BasicCourseInfo form={form} skills={skills} />
            
            <FormField
              control={form.control}
              name="course_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "group"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solo">Solo (Individual)</SelectItem>
                      <SelectItem value="duo">Duo (Pairs)</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "fixed"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Duration</SelectItem>
                      <SelectItem value="recurring">Recurring (No End Date)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="instructors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructors *</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={teacherOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select instructors"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="duration" className="mt-4 space-y-4">
            <DurationSection form={form} />
            <FormField
              control={form.control}
              name="class_types_data"
              render={({ field }) => (
                <FormItem>
                  <ClassTypesSelector
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="pricing" className="mt-4">
            <PricingSection form={form} calculateFinalPrice={calculateFinalPrice} />
          </TabsContent>

          <TabsContent value="discount" className="mt-4">
            <DiscountSection form={form} />
          </TabsContent>
        </Tabs>

        <div className="pt-6 flex justify-end gap-2 border-t">
          {cancelAction && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={cancelAction}
              className="w-24"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-music-500 hover:bg-music-600 w-24"
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CourseForm;
