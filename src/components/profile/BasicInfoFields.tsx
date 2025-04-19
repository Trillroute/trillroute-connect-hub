
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/schemas/profileSchema';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { ReadOnlyFields } from './ReadOnlyFields';
import { Card, CardContent } from '@/components/ui/card';

interface BasicInfoFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  isStudent: boolean;
}

export function BasicInfoFields({ form, isStudent }: BasicInfoFieldsProps) {
  return (
    <Card className="border border-border/40 shadow-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyFields />
          <div>
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium">Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="border-input/60 focus-visible:ring-music-300/50"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="primaryPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium">Primary Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      className="border-input/60 focus-visible:ring-music-300/50"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="secondaryPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium">Secondary Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter alternate phone number"
                      className="border-input/60 focus-visible:ring-music-300/50"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium">Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your address"
                      className="border-input/60 focus-visible:ring-music-300/50"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isStudent && (
            <>
              <div>
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-medium">Parent/Guardian Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter parent/guardian name"
                          className="border-input/60 focus-visible:ring-music-300/50"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="guardianRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-medium">Relation to Guardian</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g. Father, Mother, etc."
                          className="border-input/60 focus-visible:ring-music-300/50"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          <div className="md:col-span-2 pt-2">
            <FormField
              control={form.control}
              name="whatsappEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-music-300 data-[state=checked]:border-music-400"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-foreground/80 font-medium">
                      Enable WhatsApp notifications on primary number
                    </FormLabel>
                    <FormDescription>
                      We'll send important updates to your WhatsApp number.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
