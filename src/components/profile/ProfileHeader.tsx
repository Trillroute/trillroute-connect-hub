
import React, { useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Camera } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ProfileHeader() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
  );
}
