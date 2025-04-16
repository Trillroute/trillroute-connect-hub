
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';

// Profile update schema
const profileSchema = z.object({
  dateOfBirth: z.string().optional(),
  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  whatsappEnabled: z.boolean().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  guardianRelation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function UserProfile() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dateOfBirth: user?.dateOfBirth || '',
      primaryPhone: user?.primaryPhone || '',
      secondaryPhone: user?.secondaryPhone || '',
      whatsappEnabled: user?.whatsappEnabled || false,
      address: user?.address || '',
      parentName: user?.parentName || '',
      guardianRelation: user?.guardianRelation || '',
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        dateOfBirth: user.dateOfBirth || '',
        primaryPhone: user.primaryPhone || '',
        secondaryPhone: user.secondaryPhone || '',
        whatsappEnabled: user.whatsappEnabled || false,
        address: user.address || '',
        parentName: user.parentName || '',
        guardianRelation: user.guardianRelation || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user profile in custom_users table
      const { error } = await supabase
        .from('custom_users')
        .update({
          date_of_birth: data.dateOfBirth || null,
          primary_phone: data.primaryPhone || null,
          secondary_phone: data.secondaryPhone || null,
          whatsapp_enabled: data.whatsappEnabled || false,
          address: data.address || null,
          parent_name: data.parentName || null,
          guardian_relation: role === 'student' ? data.guardianRelation || null : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local storage to reflect changes
      const updatedUser = {
        ...user,
        dateOfBirth: data.dateOfBirth || undefined,
        primaryPhone: data.primaryPhone || undefined,
        secondaryPhone: data.secondaryPhone || undefined,
        whatsappEnabled: data.whatsappEnabled,
        address: data.address || undefined,
        parentName: data.parentName || undefined,
        guardianRelation: role === 'student' ? data.guardianRelation || undefined : undefined,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = role === 'student';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information here. Your email and name cannot be changed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Read-only fields */}
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  value={user?.firstName || ''} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                  value={user?.lastName || ''} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Email</Label>
                <Input 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>

              {/* Editable fields */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="primaryPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="secondaryPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter alternate phone number"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your address"
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
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter parent/guardian name"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="guardianRelation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relation to Guardian</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g. Father, Mother, etc."
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

              <div className="flex items-center space-x-2 md:col-span-2">
                <FormField
                  control={form.control}
                  name="whatsappEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
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

            <Button 
              type="submit" 
              className="w-full sm:w-auto" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
