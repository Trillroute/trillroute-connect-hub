
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { CourseFormValues } from '../CourseForm';

interface DurationSectionProps {
  form: UseFormReturn<CourseFormValues>;
}

const DurationSection: React.FC<DurationSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
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
  );
};

export default DurationSection;
