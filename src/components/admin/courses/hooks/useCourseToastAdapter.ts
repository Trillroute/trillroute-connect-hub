
import { useToast } from '@/hooks/use-toast';

// This adapter helps fix the incompatibility between different toast implementations
export const useCourseToastAdapter = () => {
  const { toast } = useToast();
  
  const showToast = (title: string, description: string, variant?: 'default' | 'destructive') => {
    toast({
      title,
      description,
      variant
    });
  };
  
  const showSuccessToast = (message: string) => {
    showToast("Success", message);
  };
  
  const showErrorToast = (message: string) => {
    showToast("Error", message, "destructive");
  };
  
  return { showToast, showSuccessToast, showErrorToast };
};
