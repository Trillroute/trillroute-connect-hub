
import { useToast } from '@/hooks/use-toast';

// This adapter helps fix the incompatibility between different toast implementations
export const useCourseToastAdapter = () => {
  const { toast } = useToast();
  
  const showSuccessToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };
  
  const showErrorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };
  
  return { showSuccessToast, showErrorToast };
};
