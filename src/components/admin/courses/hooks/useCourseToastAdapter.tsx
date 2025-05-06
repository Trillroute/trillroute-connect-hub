
import { useToast } from '@/hooks/use-toast';

export const useCourseToastAdapter = () => {
  const { toast } = useToast();

  const showToast = (title: string, message: string): void => {
    toast({
      title,
      description: message,
      variant: 'default',
    });
  };

  const showSuccessToast = (message: string): void => {
    toast({
      title: 'Success',
      description: message,
      variant: 'default',
    });
  };

  const showErrorToast = (message: string): void => {
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
