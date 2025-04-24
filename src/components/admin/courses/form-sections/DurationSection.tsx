
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CourseFormValues } from '../CourseForm';

interface DurationSectionProps {
  form: UseFormReturn<CourseFormValues>;
}

const DurationSection: React.FC<DurationSectionProps> = ({ form }) => {
  const durationType = form.watch('durationType');
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="durationType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-sm font-semibold">Duration Type *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed">Fixed Duration</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Recurring (No End Date)</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Choose whether this course has a fixed duration or is recurring with no end date
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {durationType === 'fixed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="durationValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Duration Value *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter duration value (e.g., 4)"
                    {...field}
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
                <FormLabel className="text-sm font-semibold">Duration Unit *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || "weeks"}
                  defaultValue={field.value || "weeks"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration unit" />
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
  );
};

export default DurationSection;
