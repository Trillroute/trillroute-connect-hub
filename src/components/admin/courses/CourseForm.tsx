import React from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Teacher } from '@/types/course';
import { cn } from '@/lib/utils';
import ClassTypesSelector from './ClassTypesSelector';
import { ClassTypeData } from '@/types/course';

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
  class_types_data?: ClassTypeData[];
  base_price: number;
  is_gst_applicable: boolean;
  gst_rate?: number;
  discount_metric: "percentage" | "fixed";
  discount_value?: number;
  discount_validity?: string;
  discount_code?: string;
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

  const watchBasePrice = form.watch('base_price');
  const watchIsGstApplicable = form.watch('is_gst_applicable');
  const watchGstRate = form.watch('gst_rate');
  const watchDiscountValue = form.watch('discount_value');
  const watchDiscountMetric = form.watch('discount_metric');

  const calculateFinalPrice = () => {
    let finalPrice = Number(watchBasePrice) || 0;
    if (watchIsGstApplicable && watchGstRate) {
      finalPrice += (finalPrice * Number(watchGstRate)) / 100;
    }
    
    if (watchDiscountValue && watchDiscountValue > 0) {
      if (watchDiscountMetric === 'percentage') {
        finalPrice -= (finalPrice * Number(watchDiscountValue)) / 100;
      } else {
        finalPrice -= Number(watchDiscountValue);
      }
    }
    return finalPrice.toFixed(2);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
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

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary skill" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Course Instructors *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedIds = value.split(',').filter(id => id);
                      field.onChange(selectedIds);
                    }}
                    defaultValue={field.value?.join(',')}
                    value={field.value?.join(',')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teachers" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem 
                          key={teacher.id} 
                          value={teacher.id}
                        >
                          {teacher.first_name} {teacher.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the instructors for this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="durationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Duration Type *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recurring" id="recurring" />
                      <Label htmlFor="recurring">Recurring</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("durationType") === "fixed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="durationValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Duration Value *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter duration" {...field} />
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
                    <FormLabel className="text-sm font-semibold">Duration Unit *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>

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

        <div className="space-y-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900">Pricing Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Base Price (₹) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      placeholder="Enter base price"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_gst_applicable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-semibold">GST Applicable</FormLabel>
                </FormItem>
              )}
            />

            {form.watch('is_gst_applicable') && (
              <FormField
                control={form.control}
                name="gst_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">GST Rate (%) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Enter GST rate"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="pt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Final Price (after GST):</p>
              <p className="text-xl font-semibold text-gray-900">₹{calculateFinalPrice()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900">Discount Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="discount_metric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Discount Value ({form.watch('discount_metric') === 'percentage' ? '%' : '₹'})
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      step={form.watch('discount_metric') === 'percentage' ? "1" : "0.01"}
                      placeholder={`Enter discount ${form.watch('discount_metric') === 'percentage' ? 'percentage' : 'amount'}`}
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_validity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Discount Valid Until</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Discount Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter discount code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
