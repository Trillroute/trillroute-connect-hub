
import { useToast } from '@/hooks/use-toast';

export const useLeadToastAdapter = () => {
  const { toast } = useToast();

  // Update the function to accept title and message parameters
  const showToast = (title: string, message: string) => {
    toast({
      title,
      description: message,
      variant: 'default',
    });
  };

  const showSuccessToast = (message: string) => {
    toast({
      title: 'Success',
      description: message,
      variant: 'default',
    });
  };

  const showErrorToast = (message: string) => {
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  };

  return {
    showToast,
    showSuccessToast,
    showErrorToast
  };
};
