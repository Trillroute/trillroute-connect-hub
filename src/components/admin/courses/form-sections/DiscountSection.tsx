
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CourseFormValues } from '../CourseForm';

interface DiscountSectionProps {
  form: UseFormReturn<CourseFormValues>;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Discount Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="discount_metric"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Discount Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || "percentage"}
                defaultValue={field.value || "percentage"}
              >
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
                  value={field.value || 0}
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
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DiscountSection;
