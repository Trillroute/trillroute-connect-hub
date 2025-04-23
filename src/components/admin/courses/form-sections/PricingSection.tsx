
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { CourseFormValues } from '../CourseForm';

interface PricingSectionProps {
  form: UseFormReturn<CourseFormValues>;
  calculateFinalPrice: () => string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ form, calculateFinalPrice }) => {
  return (
    <div className="space-y-6">
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
  );
};

export default PricingSection;
