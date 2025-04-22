
import { supabase } from "@/integrations/supabase/client";

// Function to upload a file and return a public URL
export const uploadFile = async (file: File, folder: string): Promise<string | null> => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('User not authenticated for file upload');
      return null;
    }

    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('Attempting to upload file:', filePath);

    // Upload the file to the "user-uploads" bucket
    const { error: uploadError, data } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

    console.log('File uploaded successfully:', data);

    // Get the public URL after upload
    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      console.error('No public url returned for uploaded file.');
      return null;
    }

    console.log('Generated public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};
