
import { supabase } from "@/integrations/supabase/client";

// Function to upload a file and return a public URL
export const uploadFile = async (file: File, folder: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload the file to the "user-uploads" bucket
    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

    // Get the public URL after upload
    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      console.error('No public url returned for uploaded file.');
      return null;
    }

    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};
