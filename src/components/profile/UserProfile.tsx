
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import { Loader2, Save, Camera, UserCircle } from 'lucide-react';

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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleProfilePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const fileExt = file.name.split('.').pop();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
    const isValidFileType = allowedExts.includes(fileExt?.toLowerCase() || '');
    
    if (!isValidFileType) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, PNG, or GIF image.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setUploadingPhoto(true);
    try {
      // Upload file to Supabase storage
      const filePath = `profile_photos/${user.id}/${Math.random().toString(36).substring(2)}`;
      const { data, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      // Update user profile with new photo URL
      const { error: updateError } = await supabase
        .from('custom_users')
        .update({
          profile_photo: publicUrlData.publicUrl
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local storage
      const updatedUser = {
        ...user,
        profilePhoto: publicUrlData.publicUrl
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Refresh the user object in auth context
      // This will automatically update the navbar avatar as well
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }

      toast({
        title: "Profile Photo Updated",
        description: "Your profile photo has been successfully updated.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: "Upload Failed",
        description: error?.message || "Failed to update profile photo. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const isStudent = role === 'student';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-gray-200 cursor-pointer" onClick={handleProfilePhotoClick}>
              {user?.profilePhoto ? (
                <AvatarImage 
                  src={user.profilePhoto} 
                  alt={`${user.firstName} ${user.lastName}`} 
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-2xl bg-music-100 text-music-600">
                  {getUserInitials()}
                </AvatarFallback>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </Avatar>
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-full">
                <Loader2 className="w-8 h-8 text-music-500 animate-spin" />
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={uploadingPhoto}
            />
          </div>
          <div>
            <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
            <CardDescription className="mt-1">
              {user?.email} • {role?.charAt(0).toUpperCase() + role?.slice(1)}
              <div className="text-xs text-gray-500 mt-1">Click on your avatar to update your profile picture</div>
            </CardDescription>
          </div>
        </div>
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
